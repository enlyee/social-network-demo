import {body} from "express-validator";

export const loginOrEmailValidator = body('loginOrEmail').exists()
export const passwordValidator = body('password').exists()