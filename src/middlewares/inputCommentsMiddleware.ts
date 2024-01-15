import {errorThrower} from "../validators/errorThrower";
import {commentLengthValidator} from "../validators/commentsValidators";


export const UpdateCommentsMiddleware = [commentLengthValidator,  errorThrower]
