import {inputMiddleware} from "../validators/inputMiddleware";
import {blogDescriptionValidator, blogNameValidator, blogUrlValidator} from "../validators/blogs/blogValidators";


export const InputBlogsMiddleware = [blogUrlValidator, blogNameValidator, blogDescriptionValidator,  inputMiddleware]
