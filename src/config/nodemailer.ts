import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const config = () => {
    return {
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "210206bac3d50b",
            pass: "cc26ce2e294882"
        }
    }
}

export const transporter = nodemailer.createTransport(config());
