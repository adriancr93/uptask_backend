import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const config = () => {
    const host = process.env.SMTP_HOST?.trim()
    const port = Number(process.env.SMTP_PORT)
    const user = process.env.SMTP_USER?.trim()
    const pass = process.env.SMTP_PASS?.trim()

    if (!host || !port || !user || !pass) {
        throw new Error('Missing SMTP configuration')
    }

    return {
        host,
        port,
        secure: false,
        connectionTimeout: 5000,
        greetingTimeout: 5000,
        socketTimeout: 5000,
        auth: {
            user,
            pass
        }
    }
}

export const transporter = nodemailer.createTransport(config());
