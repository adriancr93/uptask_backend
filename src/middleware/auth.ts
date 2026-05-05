import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User, { IUser } from '../models/Auth'

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
   const bearer = req.headers.authorization
   if (!bearer) {
        const error = new Error('No authorization')
        return res.status(401).json({ error: error.message })
   }

   const [_, token] = bearer.split(' ')

   try {
     const decoded = jwt.verify(token, process.env.JWT_SECRET)

     if(typeof decoded === 'object' && 'id' in decoded) {
        const user = await User.findById(decoded.id).select('_id email name')
        if(user){
            req.user = user
        } else {
            res.status(500).json({ error: 'Token not valid' })
        }
     }
   } catch (error) {
    res.status(500).json({ error: 'Invalid token' })
   }

   next()
}