import {inputMiddleware} from "../validators/inputMiddleware";
import {loginOrEmailValidator} from "../validators/userAuthValidators";
import {emailValidator, loginValidator, passwordValidator} from "../validators/userSignUpValidators";

export const InputUserAuthMiddleware = [loginOrEmailValidator, passwordValidator, inputMiddleware]

export const CreatingUserMiddleware = [loginValidator, passwordValidator, emailValidator, inputMiddleware]
