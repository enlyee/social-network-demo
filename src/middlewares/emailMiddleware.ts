import {emailValidator} from "../validators/userRegistrationValidators";
import {errorThrower} from "../validators/errorThrower";

export const emailMiddleware = [emailValidator, errorThrower]