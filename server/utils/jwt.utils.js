import jwt from 'jsonwebtoken';

export const generateToken = async (payload) => {
    try {
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: '7d',
        });
        return token;
    } catch (e) {
        console.error('Error Generating JWT: ', e);
        throw new Error('JWT Generation Failed');
    }
};

export const verifyJwtToken = (token) => {
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return payload;
    } catch (e) {
        console.error('Error Verifying JWT: ', e);
        throw new Error('JWT Verification Failed');
    }
};
