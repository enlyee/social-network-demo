import {body} from "express-validator";

export const passwordRecoveryValidator = body('email').exists().matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')