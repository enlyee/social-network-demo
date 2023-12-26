import {NextFunction, Request, Response} from "express";
import {body, ValidationError, validationResult} from "express-validator";
import {blogRepository} from "../repositories/blog-repository";
import {inputMiddleware} from "../validators/inputMiddleware";

const blogNameValidator = body('name').trim().isLength({min: 1, max: 15})
const blogDescriptionValidator = body('description').trim().isLength({min: 1, max: 500})
const blogUrlValidator = body('websiteUrl').trim().isLength({min: 1, max: 100}).matches('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
/*const isExistsName = body('name').custom(v => {
    const blog = blogRepository.findBlogByName(v)
    if (blog) {
        throw new Error('Blog already exist')
    }
    return true
})*/
export const newInputBlogsValidation = [/*isExistsName,*/ blogUrlValidator, blogNameValidator, blogDescriptionValidator,  inputMiddleware]
export const updateInputBlogsValidation = [blogUrlValidator, blogNameValidator, blogDescriptionValidator,  inputMiddleware]

