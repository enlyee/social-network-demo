import {body} from "express-validator";
import {authRepository} from "../repositories/authRepository";

export const confirmationEmailCodeValidator = body('code').custom(async (code)=>{
    const confirmation = await authRepository.getConfirmation(code)
    if ( !confirmation || (confirmation.expirationDate < new Date()) ) {
        throw new Error('Code is incorrect, expired or already been applied')
    }
    return true
})
export const confirmationEmailValidator = body('email').matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$').custom(async (email)=>{
    const confirmation = await authRepository.getUserConfirmationStatusByEmail(email)
    if ( confirmation !== false ) {
        throw new Error('Email is not registered yet, incorrect or already been confirmed')
    }
    return true
})