import {Router} from "express";
import {LoginUserMiddleware} from "../middlewares/loginUserMiddleware";
import {UserAuthMiddleware} from "../middlewares/userAuthMiddleware";
import {RegistrationUserMiddleware} from "../middlewares/registrationUserMiddleware";
import {EmailConfirmationCodeMiddleware} from "../middlewares/confirmationEmailMiddleware";
import {emailResendingMiddleware} from "../middlewares/emailResendingMiddleware";
import {RateLimitIpMiddleware} from "../middlewares/rateLimitIpMiddleware";
import {PasswordRecoveryMiddleware} from "../middlewares/passwordRecoveryMiddleware";
import {NewPasswordMiddleware} from "../middlewares/newPasswordMiddleware";
import {container} from "../composition-root";
import {AuthController} from "../controllers/authController";

export const authRouter = Router({})

const authController = container.resolve(AuthController)

authRouter.post('/login', RateLimitIpMiddleware, LoginUserMiddleware, authController.loginUser.bind(authController) )

authRouter.get('/me', RateLimitIpMiddleware, UserAuthMiddleware, authController.getUserInfo.bind(authController) )

authRouter.post('/registration', RateLimitIpMiddleware, ...RegistrationUserMiddleware, authController.registerUser.bind(authController) )

authRouter.post('/registration-confirmation', RateLimitIpMiddleware, ...EmailConfirmationCodeMiddleware, authController.confirmEmail.bind(authController) )

authRouter.post('/registration-email-resending', RateLimitIpMiddleware, ...emailResendingMiddleware, authController.resendEmail.bind(authController) )

authRouter.post('/refresh-token', authController.updateTokens.bind(authController) )

authRouter.post('/logout', authController.logoutUser.bind(authController) )

authRouter.post('/password-recovery', RateLimitIpMiddleware, ...PasswordRecoveryMiddleware, authController.recoveryPassword.bind(authController) )

authRouter.post('/new-password', RateLimitIpMiddleware, ...NewPasswordMiddleware, authController.changePassword.bind(authController) )


