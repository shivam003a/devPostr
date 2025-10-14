import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { forgotPasswordEmailTemplate, otpEmailTemplate, passwordChangedEmailTemplate, welcomeEmailTemplate } from '../templates/emailTemplates.js';

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
    }
};

export const sendWelcomeEmail = async (to, name) => {
    try {
        const info = await transporter.sendMail({
            from: `"devPostr" <${process.env.EMAIL_USER}>`,
            to,
            subject: "Welcome to DevPostr - Let's Get Started!",
            html: welcomeEmailTemplate(name),
        });

        console.log('Email Sent: ', info?.messageId);
    } catch (e) {
        console.error('Error Sending Email: ', e);
    }
};

export const sendForgotPasswordEmail = async (to, name, resetLink) => {
    try {
        const info = await transporter.sendMail({
            from: `"devPostr" <${process.env.EMAIL_USER}>`,
            to,
            subject: "Reset your devPostr password",
            html: forgotPasswordEmailTemplate(name, resetLink)
        })

        console.log('Email Sent: ', info?.messageId);
    } catch (e) {
        console.error('Error Sending Email: ', e);
    }
}

export const sendPasswordChangedEmail = async (to, name) => {
    try {
        const info = await transporter.sendMail({
            from: `"devPostr" <${process.env.EMAIL_USER}>`,
            to,
            subject: "Your devPostr password was changed",
            html: passwordChangedEmailTemplate(name)
        })

        console.log('Email Sent: ', info?.messageId);
    } catch (e) {
        console.error('Error Sending Email: ', e);
    }
}