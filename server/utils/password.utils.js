import bcrypt from 'bcryptjs';

export const hashPassword = async (password) => {
    try {
        if (!password) {
            throw new Error('Param: {password} not Passed');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    } catch (e) {
        console.error(e?.message);
        throw new Error(e?.message || 'Error Hashing Password');
    }
};

export const comparePassword = async (password, hashedPassword) => {
    try {
        if (!password) {
            throw new Error('All Params Required');
        }
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (e) {
        console.error(e?.message);
        throw new Error(e?.message || 'Error Hashing Password');
    }
};
