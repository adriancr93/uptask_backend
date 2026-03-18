import type {Request, Response} from 'express'
import User from '../models/Auth'
import { hashPassword } from '../utils/auth'
import Token from '../models/Token'
import { generateToken } from '../utils/token'
import { AuthEmail } from '../emails/AuthEmail'

export class AuthController {
    
    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body 
            
            //Prevent duplicate
            const userExists = await User.findOne({email})
            if(userExists) {
                return res.status(409).json({error: 'Email already in use'})
            }

            const user = new User(req.body)

            //Hash Password
            user.password = await hashPassword(password)

            //Generate confirmation token
            const token = new Token()
            token.token = generateToken()
            token.user = user._id

            //Send email with token (omitted for brevity, use nodemailer or similar)
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])
            res.send('User created successfully, check your email to confirm your account')
        } catch (error) {
            res.status(500).json({error: 'Error creating account'})
        }
    }
}