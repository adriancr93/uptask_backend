import type {Request, Response} from 'express'
import User from '../models/Auth'
import { hashPassword } from '../utils/auth'

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
            await user.save()
            res.send('User created successfully, check your email to confirm your account')
        } catch (error) {
            res.status(500).json({error: 'Error creating account'})
        }
    }
}