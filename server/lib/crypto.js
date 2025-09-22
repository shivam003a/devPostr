import CryptoJS from "crypto-js";
import dotenv from 'dotenv';

dotenv.config()

export const encryptData = (data) => {
    const CRYPTO_SECRET_KEY = process.env.CRYPTO_SECRET_KEY

    if (!CRYPTO_SECRET_KEY) {
        throw new Error("Can't encrypt")
    }
    const cipherText = CryptoJS.AES.encrypt(data, CRYPTO_SECRET_KEY).toString();
    return cipherText;
}

export const decryptData = (data) => {
    const CRYPTO_SECRET_KEY = process.env.CRYPTO_SECRET_KEY

    if (!CRYPTO_SECRET_KEY) {
        throw new Error("Can't decrypt")
    }
    const bytes = CryptoJS.AES.decrypt(data, CRYPTO_SECRET_KEY)
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8)
    return decryptedData;
}