import {body} from "express-validator";
import {authRepository} from "../repositories/authRepository";

export const newPasswordValidator = body('newPassword').isLength({min: 6, max: 20})

export const newPasswordCodeValidator = body('recoveryCode').exists().custom(async (code)=>{
        const status = await authRepository.getUpdatePasswordCode(code)
        if (!status) {
            throw new Error('RecoveryCode is incorrect or expired')
        }
        return true
})