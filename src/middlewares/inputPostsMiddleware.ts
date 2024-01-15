import {errorThrower} from "../validators/errorThrower";
import {
    postBlogIdIsExists,
    postContentValidator,
    postDescriptionValidator,
    postTitleValidator
} from "../validators/postValidator";

export const InputPostsMiddleware = [postBlogIdIsExists, postTitleValidator, postDescriptionValidator, postContentValidator, errorThrower]
export const InputPostsMiddlewareWithoutId = [postTitleValidator, postDescriptionValidator, postContentValidator, errorThrower]
