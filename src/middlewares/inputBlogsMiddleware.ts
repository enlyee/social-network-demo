import {errorThrower} from "../validators/errorThrower";
import {blogDescriptionValidator, blogNameValidator, blogUrlValidator} from "../validators/blogValidators";


export const InputBlogsMiddleware = [blogUrlValidator, blogNameValidator, blogDescriptionValidator,  errorThrower]
