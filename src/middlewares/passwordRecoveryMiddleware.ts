import {passwordRecoveryValidator} from "../validators/passwordRecoveryValidator";
import {errorThrower} from "../validators/errorThrower";

export const PasswordRecoveryMiddleware = [passwordRecoveryValidator, errorThrower]