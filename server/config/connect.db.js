import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config();

export const connectDB = async () => {
    try {
        const DB_URI = process.env.DB_URI;
        if (!DB_URI) {
            throw new Error("DB_URL can't be empty");
        }

        const conn = await mongoose.connect(DB_URI, {
            dbName: 'devPostr',
        });
        console.log('Database Connected:', conn?.connection?.host);
    } catch (e) {
        console.error(`Database Connection Failed:`, e?.message);
        process.exit(1);
    }
};
