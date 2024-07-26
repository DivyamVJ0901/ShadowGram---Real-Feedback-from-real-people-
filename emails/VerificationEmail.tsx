import nodemailer from 'nodemailer';
import { ApiResponse } from "@/types/ApiResponse";

const senderEmail = process.env.EMAIL;
const pass = process.env.EMAIL_PASS;

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., 'gmail'
    auth: {
        user: senderEmail, // your email
        pass: pass // your email password
    }
});


export default async function sendverificationmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        // Send mail with defined transport object
        const info = await transporter.sendMail({
            from: senderEmail, // sender address
            to: email, // list of receivers
            subject: 'Shadowgram | Verification Code', // Subject line
            html: `<p>Hello <strong>${username},</strong></p>
                   <p>Your verification code is: <strong>${verifyCode}</strong></p>
                   <p>Thank you for using ShadowGram!</p>` // html body
        });

        // Log the message ID (optional)
        return {
            success: true,
            message: 'Verification email sent successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: 'Failed to send verification email'
        };
    }
}