import dotenv from 'dotenv';
dotenv.config();

export const cookieOptions = () => {
    return {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };
};
