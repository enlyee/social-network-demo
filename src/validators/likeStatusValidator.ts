import {body} from "express-validator";

export const likeStatusValidator = body('likeStatus').matches('^(Like|Dislike|None)$')