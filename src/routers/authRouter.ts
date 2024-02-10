import {Router} from "express";
import {Request, Response} from "express";
import {AuthType, RequestWithBody} from "../models/commonType";
import {usersService} from "../domain/usersService";
import {LoginUserMiddleware} from "../middlewares/loginUserMiddleware";
import {jwtService} from "../application/jwtService";
import {UserAuthMiddleware} from "../middlewares/userAuthMiddleware";
import {UsersInputType} from "../models/usersTypes";
import {authService} from "../domain/authService";
import {RegistrationUserMiddleware} from "../middlewares/registrationUserMiddleware";
import {EmailConfirmationCodeMiddleware} from "../middlewares/confirmationEmailMiddleware";
import {emailResendingMiddleware} from "../middlewares/emailResendingMiddleware";
import {RateLimitIpMiddleware} from "../middlewares/rateLimitIpMiddleware";
import {jwtAdapter} from "../adapters/jwtAdapter";

export const authRouter = Router({})

authRouter.post('/login', RateLimitIpMiddleware, LoginUserMiddleware, async (req: RequestWithBody<AuthType>, res: Response) => {
    //todo sokratitttt
    const userId = await authService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (!userId) {
        res.sendStatus(401)
        return
    }
    const refreshToken = await jwtService.createLoginJwtRefreshToken(userId, req.ip!, req.headers["user-agent"] || 'Unknown')
    const token = await jwtService.createJwtAccessToken(userId)
    res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,})
    res.status(200).send({
        "accessToken": token
    })
})

authRouter.get('/me', RateLimitIpMiddleware, UserAuthMiddleware, async (req: Request,  res: Response) => {
    const user = await usersService.findUserById(req.userId!)
    res.send(user)
})

authRouter.post('/registration', RateLimitIpMiddleware, ...RegistrationUserMiddleware, async (req: RequestWithBody<UsersInputType>, res: Response)=>{
    await authService.createUser(req.body.login, req.body.password, req.body.email)
    res.sendStatus(204)
})

authRouter.post('/registration-confirmation', RateLimitIpMiddleware, ...EmailConfirmationCodeMiddleware, async (req: RequestWithBody<{ code: string }>, res: Response)=>{
    await authService.emailConfirmation(req.body.code)
    res.sendStatus(204)
})

authRouter.post('/registration-email-resending', RateLimitIpMiddleware, ...emailResendingMiddleware, async (req: RequestWithBody<{ email: string }>, res: Response) =>{
    await authService.resendEmail(req.body.email)
    res.sendStatus(204)
})

authRouter.post('/refresh-token', async (req: Request, res: Response) =>{
    /////////////////todo!!!!!!!!!!!!!
    const oldToken = req.cookies.refreshToken
    const decToken = await jwtAdapter.getTokenPayload(oldToken)
    if (!decToken) {
        res.sendStatus(401)
        return
    }
    const refreshToken = await jwtService.updateJwtRefreshToken(decToken.userId, decToken.deviceId, (await jwtAdapter.getTokenIssuing(oldToken))!)
    if (!refreshToken) {
        res.sendStatus(401)
        return
    }
    const token = await jwtService.createJwtAccessToken(decToken.userId)
    res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,})

    res.status(200).send({
        "accessToken": token
    })
})

authRouter.post('/logout', async (req: Request, res: Response) => {
    const oldToken = req.cookies.refreshToken
    const tokenInfo = await jwtAdapter.getTokenPayload(oldToken)
    if (!tokenInfo) {
        res.sendStatus(401)
        return
    }
    const deletingSessionStatus = await authService.deleteSession(tokenInfo.userId, tokenInfo.deviceId, (await jwtAdapter.getTokenIssuing(oldToken))!)
    if (!deletingSessionStatus) {
        res.sendStatus(401)
        return
    }
    res.sendStatus(204)
})


