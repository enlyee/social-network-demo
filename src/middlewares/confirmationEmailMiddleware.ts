import {confirmationEmailCodeValidator} from "../validators/confirmationEmailCodeValidator";
import {errorThrower} from "../validators/errorThrower";

export const EmailConfirmationCodeMiddleware = [confirmationEmailCodeValidator, errorThrower]