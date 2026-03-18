import { transporter } from "../config/nodemailer"

interface IEmail {
    email: string,
    name: string,
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async( user : IEmail ) => {
        const info = await transporter.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: user.email,
            subject: 'UpTask - Confirm your account',
            text: 'UpTask - Confirm your account',
            html: `<p>Hola: ${user.name}. created you account in UpTask, almost your are ready,
             just confirm your account</p>
               <p>Visite the URL:</p>
               <a href=""> Confirm Account </a>
               <p> and insert the token: <b>${user.token}</b></p>
               <p> This token expire in 10 minutes</p>
            `
        }).then(info => {
            console.log('Email sent:', info.messageId);
            return ({ success: true, info });
        }).catch(error => {
            console.error('Error sending email:', error);
            return ({ success: false, error: error.message });
        });

    }
}