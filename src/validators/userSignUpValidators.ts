import {body} from "express-validator";

export const loginValidator = body('login').isLength({min: 3, max: 10}).matches('^[a-zA-Z0-9_-]*$')
export const passwordValidator = body('password').isLength({min: 6, max: 20})
export const emailValidator = body('email').matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')