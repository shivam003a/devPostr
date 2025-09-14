import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadToCloudinary = async (buffer, folder = "devPostr/") => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder }, (error, result) => {
            if (error) return reject(error);
            return resolve(result);
        }).end(buffer)
    })
}

export default cloudinary;