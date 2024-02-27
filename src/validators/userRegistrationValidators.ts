import {body} from "express-validator";
import {UsersRepository} from "../repositories/usersRepository";
const usersRepository = new UsersRepository()
export const loginValidator = body('login').isLength({min: 3, max: 10}).matches('^[a-zA-Z0-9_-]*$').custom(async (login)=>{
    const user = await usersRepository.findUserByLoginOrEmail(login)
    if (user) {
        throw new Error('This login is already exist')
    }
    return

})
export const passwordValidator = body('password').isLength({min: 6, max: 20})
export const emailValidator  = body('email').matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$').custom(async (email)=>{
    const user = await usersRepository.findUserByLoginOrEmail(email)
    if (user) {
        throw new Error('This email is already exist')
    }
    return

})