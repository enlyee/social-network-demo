import {inputMiddleware} from "../validators/inputMiddleware";
import {
    postBlogIdIsExists,
    postContentValidator,
    postDescriptionValidator,
    postTitleValidator
} from "../validators/postValidator";

export const InputPostsMiddleware = [postBlogIdIsExists, postTitleValidator, postDescriptionValidator, postContentValidator, inputMiddleware]
export const InputPostsMiddlewareWithoutId = [postTitleValidator, postDescriptionValidator, postContentValidator, inputMiddleware]
