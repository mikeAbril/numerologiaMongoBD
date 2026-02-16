import { text } from 'express';
import nodemailer from 'nodemailer'

export function sendEmail(to, subject, body){
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth : {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_Pass,
        },
    });
    const mailOptions ={
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: body,
        html: '<h1>Encabezado en HTML</h1><p>Este es el cuerpo del correo en <strong>HTML</strong>.</p>'    
    };

    transporter.sendMail(mailOptions, (error, info) =>{
        if (error) {
            console.log('Error al enviar correo:',error);
            
        } else {
            console.log('Correo enviado:' + info.response);
            
        }
    })
}