import { sendOtpEmail, sendWelcomeEmail } from '../lib/nodemailer.lib.js';
import User from '../models/user.models.js';
import { generateOtp } from '../utils/otpGen.utils.js';
import { hashPassword, comparePassword } from '../utils/password.utils.js';
import { generateToken } from '../utils/jwt.utils.js';
import { cookieOptions } from '../utils/cookieOptions.js';
import { loginSchema, registerSchema, verifyOtpSchema } from '../utils/zod.utils.js';

export const register = async (req, res) => {
    try {
        // validate req.body
        const parsed = registerSchema?.safeParse(req.body)
        if (!parsed?.success) {
            const errorsMsg = parsed?.error?.issues.map((err) => err?.message).join(', ')
            return res.error(errorsMsg, null, 400)
        }
        const { name, email, password } = parsed?.data;

        // basic validation
        if (!name || !email || !password) {
            return res.error('All Fields Required', null, 400);
        }

        // checking for existing email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (!existingUser?.isVerified) {
                // hashing password
                const hashedPassword = await hashPassword(password);

                const otpCode = generateOtp();
                const otpCodeExpiresIn = Date.now() + 5 * 60 * 1000;
                existingUser.otpCode = otpCode;
                existingUser.otpCodeExpiresIn = otpCodeExpiresIn;
                existingUser.password = hashedPassword;

                await existingUser.save();
                sendOtpEmail(email, otpCode);

                return res.success(
                    'OTP resent to your email',
                    { _id: existingUser?._id, email: existingUser?.email, navigate: '/verify-otp' },
                    200
                );
            } else {
                return res.error('Email Already Used', null, 409);
            }
        }

        // hashing password
        const hashedPassword = await hashPassword(password);

        // genrate OTP
        const otpCode = generateOtp();
        const otpCodeExpiresIn = Date.now() + 5 * 60 * 1000;

        // Send Email
        sendOtpEmail(email, otpCode);

        // save user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            otpCode,
            otpCodeExpiresIn,
            isVerified: false,
        });

        // response
        return res.success('Email Registered', { _id: user?._id, email: user?.email, navigate: '/verify-otp' }, 201);
    } catch (e) {
        console.error(e?.message || 'Internal Server Error');
        return res.error('Internal Server Error', null, 500);
    }
};

export const login = async (req, res) => {
    try {
        // validate req.body
        const parsed = loginSchema?.safeParse(req.body)
        if (!parsed?.success) {
            const errorsMsg = parsed?.error?.issues.map((err) => err?.message).join(', ')
            return res.error(errorsMsg, null, 400)
        }
        const { email, password } = parsed?.data;

        // basic validation
        if (!email || !password) {
            return res.error('All Fields Required', null, 400);
        }

        // check if user exist
        const existingUser = await User.findOne({ email });

        // if user does not exist, return
        if (!existingUser) {
            return res.error('Email Not Registered', null, 404);
        }

        // verify password
        const isMatch = await comparePassword(password, existingUser?.password);
        if (!isMatch) {
            return res.error('Invalid Credentials', null, 401);
        }

        // if isVerified: false, resend otp
        if (!existingUser?.isVerified) {
            const otpCode = generateOtp();
            const otpCodeExpiresIn = Date.now() + 5 * 60 * 1000;
            existingUser.otpCode = otpCode;
            existingUser.otpCodeExpiresIn = otpCodeExpiresIn;

            await existingUser.save();
            sendOtpEmail(email, otpCode);

            return res.success(
                'OTP resent to your email',
                { _id: existingUser?._id, email: existingUser?.email, navigate: 'verify-otp' },
                200
            );
        }

        // generate jwt token
        const payload = {
            _id: existingUser?._id,
            email: existingUser?.email,
            isVerified: existingUser?.isVerified,
        };
        const token = await generateToken(payload);

        // set cookie
        res.cookie('token', token, cookieOptions());

        // response
        const userObj = existingUser?.toObject();
        delete userObj?.password;
        delete userObj?.otpCode;
        delete userObj?.otpCodeExpiresIn;
        delete userObj?.twitterAccessSecret;
        delete userObj.twitterAccessToken;

        return res.success('Login Successful', userObj, 200);
    } catch (e) {
        console.error(e?.message || 'Internal Server Error');
        return res.error('Internal Server Error', null, 500);
    }
};

export const verifyOtp = async (req, res) => {
    try {
        // validate req.body
        const parsed = verifyOtpSchema?.safeParse(req.body)
        if (!parsed?.success) {
            const errorsMsg = parsed?.error?.issues.map((err) => err?.message).join(', ')
            return res.error(errorsMsg, null, 400)
        }
        const { _id, email, otpCode } = parsed?.data;

        // basic validation
        if (!_id || !email) {
            return res.error('_id & email are required', null, 400);
        }
        if (!otpCode) {
            return res.error('OTP is required', null, 400);
        }

        // check if user exist
        const existingUser = await User.findOne({
            email,
            _id,
        });

        // if user does not exist return
        if (!existingUser) {
            return res.error('Email Not Found', null, 404);
        }

        if (existingUser?.isVerified) {
            return res.error('Email Already Verified', null, 409);
        }

        // if exist, verify otp
        if (Date.now() > existingUser?.otpCodeExpiresIn) {
            return res.error('OTP Expired', null, 401);
        }

        if (otpCode !== existingUser?.otpCode) {
            return res.error('Invalid OTP', null, 401);
        }

        // if otp matched, reset otpCode, OptCodeExpiresIn, set isVerified: true
        existingUser.isVerified = true;
        existingUser.otpCode = null;
        existingUser.otpCodeExpiresIn = null;

        const updatedUser = await existingUser.save();

        // generate jwt and cookie
        const payload = {
            _id: updatedUser?._id,
            email: updatedUser?.email,
            isVerified: updatedUser?.isVerified,
        };
        const token = await generateToken(payload);

        // set cookie
        res.cookie('token', token, cookieOptions());

        // send welcome mail
        sendWelcomeEmail(existingUser?.email, existingUser?.name);

        // response
        const userObj = updatedUser.toObject();
        delete userObj.password;
        delete userObj.otpCode;
        delete userObj.otpCodeExpiresIn;
        delete userObj.twitterAccessSecret;
        delete userObj.twitterAccessToken;

        return res.success('OTP verified successfully', userObj, 200);
    } catch (e) {
        console.error(e?.message || 'Internal Server Error');
        return res.error('Internal Server Error', null, 500);
    }
};

export const logout = (req, res) => {
    try {
        const { httpOnly, secure, sameSite, path } = cookieOptions();
        res.clearCookie('token', {
            httpOnly,
            secure,
            sameSite,
            path,
        });

        return res.success('User Logged Out', null, 200);
    } catch (e) {
        console.error(e?.message || 'Internal Server Error');
        return res.error('Internal Server Error', null, 500);
    }
};

export const checkAuth = async (req, res) => {
    try {
        const { _id } = req.user;

        if (!_id) {
            return res.error('Invalid User', null, 400);
        }

        const user = await User.findOne({ _id, isVerified: true }).select(
            '-password -otpCode -otpCodeExpiresIn -twitterAccessSecret -twitterAccessToken'
        );
        if (!user) {
            return res.error('User Not Found', null, 404);
        }

        return res.success('User authenticated', user, 200);
    } catch (e) {
        console.error(e?.message || 'Internal Server Error');
        return res.error('Internal Server Error', null, 500);
    }
};
