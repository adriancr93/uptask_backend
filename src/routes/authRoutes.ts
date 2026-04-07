import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/AuthController';
import { handledinputErrors } from '../middleware/validation';

const router = Router()

router.post('/create-account', 
    body('name').notEmpty().withMessage('Name is required'),
    body('password').isLength({min: 8}).withMessage('Password must be at least 8 characters'),
    body('password_confirmation').custom((value, {req}) => {
        if(value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true
    }),
    body('email').isEmail().withMessage('Email is not valid'),
    handledinputErrors,
    AuthController.createAccount
)

router.post('/confirm-account', 
    body('token').notEmpty().withMessage('Token must not be empty'),
    handledinputErrors,
    AuthController.confirmAccount
)

router.post('/login', 
    body('email').isEmail().withMessage('Email is not valid'),
    body('password').notEmpty().withMessage('Password cant be empty'),
    handledinputErrors,
    AuthController.login
)

router.post('/request-code', 
    body('email').isEmail().withMessage('Email is not valid'),
    handledinputErrors,
    AuthController.requestConfirmCode
)

export default router;