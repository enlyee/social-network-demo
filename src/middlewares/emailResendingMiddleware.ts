import {errorThrower} from "../validators/errorThrower";
import {confirmationEmailCodeValidator, confirmationEmailValidator} from "../validators/confirmationEmailCodeValidator";

export const emailResendingMiddleware = [confirmationEmailValidator, errorThrower]