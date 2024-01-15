import {errorThrower} from "../validators/errorThrower";
import {emailValidator, loginValidator, passwordValidator} from "../validators/userRegistrationValidators";

export const RegistrationUserMiddleware = [loginValidator, passwordValidator, emailValidator, errorThrower]
