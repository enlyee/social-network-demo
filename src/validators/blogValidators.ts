import {body} from "express-validator";

export const blogNameValidator = body('name').trim().isLength({min: 1, max: 15})
export const blogDescriptionValidator = body('description').trim().isLength({min: 1, max: 500})
export const blogUrlValidator = body('websiteUrl').trim().isLength({min: 1, max: 100}).matches('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
