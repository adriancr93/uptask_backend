import type {Request, Response} from 'express'
import User from '../models/Auth'

export class AuthController {
    
    static createAccount = async (req: Request, res: Response) => {
        try {
            const user = new User(req.body)
            await user.save()
            res.send('User created successfully, check your email to confirm your account')
        } catch (error) {
            res.status(500).json({error: 'Internal Server Error'})
        }
    }

}