import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { otpEmailTemplate, welcomeEmailTemplate } from '../templates/emailTemplates.js';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendOtpEmail = async (to, otp) => {
    try {
        const info = await transporter.sendMail({
            from: `"devPostr" <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Your OTP Code',
            html: otpEmailTemplate(otp),
        });

        console.log('Email Sent: ', info?.messageId);
    } catch (e) {
        console.error('Error Sending Email: ', e);
        throw new Error(e?.message || 'Failed to send OTP');
    }
};

export const sendWelcomeEmail = async (to, name) => {
    try {
        const info = await transporter.sendMail({
            from: `"devPostr" <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Welcome to DevPostr – Let’s Get Started!',
            html: welcomeEmailTemplate(name),
        });

        console.log('Email Sent: ', info?.messageId);
    } catch (e) {
        console.error('Error Sending Email: ', e);
        throw new Error(e?.message || 'Failed to send OTP');
    }
};
