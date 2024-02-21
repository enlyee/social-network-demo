import {likeStatusValidator} from "../validators/likeStatusValidator";
import {errorThrower} from "../validators/errorThrower";

export const LikeStatusMiddleware = [likeStatusValidator, errorThrower]