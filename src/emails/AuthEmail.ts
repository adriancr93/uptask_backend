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
               <a href="${process.env.FRONTEND_URL}/auth/confirm-account"> Confirm Account </a>
               <p> and insert the token: <b>${user.token}</b></p>
               <p> This token expire in 10 minutes</p>
            `
        })

        console.log('Message sent: %s', info.messageId)

    }

    static sendPasswordResetToken = async( user : IEmail ) => {
        const info = await transporter.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: user.email,
            subject: 'UpTask - Reset your password',
            text: 'UpTask - Reset your password',
            html: `<p>Hola: ${user.name}. You requested to reset your password in UpTask.</p>
               <p>Visit the URL:</p>
               <a href="${process.env.FRONTEND_URL}/auth/new-password"> Reset Password </a>
               <p> and insert the token: <b>${user.token}</b></p>
               <p> This token expire in 10 minutes</p>
            `
        })

        console.log('Message sent: %s', info.messageId)

    }
}
