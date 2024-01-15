import {body} from "express-validator";

export const commentLengthValidator = body('content').isLength({min: 20, max: 300})