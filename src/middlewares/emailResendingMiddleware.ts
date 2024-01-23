import {errorThrower} from "../validators/errorThrower";
import {confirmationEmailCodeValidator} from "../validators/confirmationEmailCodeValidator";

export const emailResendingMiddleware = [confirmationEmailCodeValidator, errorThrower]