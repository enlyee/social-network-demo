import {body} from "express-validator";

export const loginOrEmailValidator = body('loginOrEmail').exists()
export const authPasswordValidator = body('password').exists()