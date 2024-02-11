import {newPasswordCodeValidator, newPasswordValidator} from "../validators/newPasswordValidator";
import {errorThrower} from "../validators/errorThrower";

export const NewPasswordMiddleware = [newPasswordValidator, newPasswordCodeValidator, errorThrower]