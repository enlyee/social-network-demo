import {errorThrower} from "../validators/errorThrower";
import {authPasswordValidator, loginOrEmailValidator} from "../validators/userLoginValidators";

export const LoginUserMiddleware = [loginOrEmailValidator, authPasswordValidator, errorThrower]
