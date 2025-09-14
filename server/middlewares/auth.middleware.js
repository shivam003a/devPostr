import { verifyJwtToken } from '../utils/jwt.utils.js';
import User from '../models/user.models.js';

export const verifyAuth = async (req, res, next) => {
    try {
        const token = req?.cookies?.token;

        if (!token) {
            return res.error('No Token Found', null, 401);
        }

        const payload = verifyJwtToken(token);
        if (!payload) {
            return res.error('Invalid Token', null, 401);
        }

        const user = await User.findById(payload?._id);
        if (!user) {
            return res.error('User Not Found', null, 404);
        }

        req.user = user;
        next();
    } catch (e) {
        console.error('Error Verifiying Auth: ', e);
        return res.error(e?.message || 'Auth Verification Failed', null, 500);
    }
};
