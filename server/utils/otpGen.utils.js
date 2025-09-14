import crypto from 'crypto';

export const generateOtp = () => {
    const otpCode = crypto.randomInt(100000, 999999).toString();
    return otpCode;
};
