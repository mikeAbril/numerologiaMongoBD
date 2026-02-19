import { text } from 'express';
import nodemailer from 'nodemailer'

export const sendEmail = async(to, subject, body)=>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth : {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_Pass,
        },
    });
    const mailOptions ={
        from: `"Numerologia 3000" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: subject,
        text: body,
        html: `<b>${body}</b>`
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Correo enviado con éxito:',info.response);
        return info;
        
    } catch (error) {
        console.log(`❌Error al enviar correo:`,error);
        throw error
        
    }
}