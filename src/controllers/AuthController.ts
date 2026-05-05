import type {Request, Response} from 'express'
import User from '../models/Auth'
import { checkPassword, hashPassword } from '../utils/auth'
import Token from '../models/Token'
import { generateToken } from '../utils/token'
import { AuthEmail } from '../emails/AuthEmail'
import { generateJWT } from '../utils/jwt'

export class AuthController {
    
    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body 
            
            //Prevent duplicate
            const userExists = await User.findOne({email})
            if(userExists) {
                return res.status(409).json({ error: 'Email already in use' })
            }

            const user = new User(req.body)

            //Hash Password
            user.password = await hashPassword(password)

            //Generate confirmation token
            const token = new Token()
            token.token = generateToken()
            token.user = user._id

            await Promise.all([user.save(), token.save()])

            await AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            res.send('User created successfully, check your email to confirm your account')
        } catch (error) {
            res.status(500).json({error: 'Error creating account'})
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body

            const tokenExists = await Token.findOne({token})
            if(!tokenExists) {
                const error = new Error('Invalid token')
                return res.status(404).json({ error: error.message })
            }

            const user = await User.findById(tokenExists.user)
            user.confirmed = true
            await Promise.allSettled([ user.save(), tokenExists.deleteOne()])
            
            res.send('Account confirmed successfully')
        } catch (error) {
            res.status(500).json({error: 'Error confirming account'})
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email })
            if(!user) {
                const error = new Error('User not found')
                return res.status(404).json({error: error.message})
            }

            if(!user.confirmed) {
                const token = new Token()
                token.user = user._id
                token.token = generateToken()
                await token.save()

                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                const error = new Error('Account not confirmed, a new confirmation email has been sent')
                return res.status(401).json({error: error.message})
            }

            //Check password
            const isPasswordCorrect = await checkPassword(password, user.password)
            if(!isPasswordCorrect) {
                const error = new Error('Incorrect password')
                return res.status(401).json({error: error.message})
            }
            
            const token = generateJWT({id: user._id.toString()})
            
            res.send({ token })

        } catch (error) {
            res.status(500).json({error: 'Error logging in'})
        }
    }

    static requestConfirmCode = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body 
            
            //User Exists
            const user = await User.findOne({email})
            if(!user) {
                const error = new Error('User not found')
                return res.status(404).json({ error: error.message })
            }

            if(user.confirmed) {
                const error = new Error('Account already confirmed')
                return res.status(409).json({ error: error.message })
            }

            //Generate confirmation token
            const token = new Token()
            token.token = generateToken()
            token.user = user._id

            await Promise.all([user.save(), token.save()])
        
            // Send email
            await AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            res.send('Send new token again')
        } catch (error) {
            res.status(500).json({ error: 'Error creating account' })
        }
    }

    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body 
            
            //User Exists
            const user = await User.findOne({email})
            if(!user) {
                const error = new Error('User not found')
                return res.status(404).json({ error: error.message })
            }

            //Generate confirmation token
            const token = new Token()
            token.token = generateToken()
            token.user = user._id
            await token.save()
            
            // Send email
            await AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })
            
            res.send('Check your email for reset password instructions')
        } catch (error) {
            res.status(500).json({ error: 'Error creating account' })
        }
    }

    static validateToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body

            const tokenExists = await Token.findOne({token})
            if(!tokenExists) {
                const error = new Error('Invalid token')
                return res.status(404).json({ error: error.message })
            }
            res.send('Token is valid, Define your new password')
        } catch (error) {
            res.status(500).json({error: 'Error confirming account'})
        }
    }

    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.params

            const tokenExists = await Token.findOne({token})
            if(!tokenExists) {
                const error = new Error('Invalid token')
                return res.status(404).json({ error: error.message })
            }

            const user = await User.findById(tokenExists.user)
            user.password = await hashPassword(req.body.password)
            
            await Promise.allSettled([ user.save(), tokenExists.deleteOne()])

            res.send('Password updated successfully')
        } catch (error) {
            res.status(500).json({error: 'Error updating password'})
        }
    }
}