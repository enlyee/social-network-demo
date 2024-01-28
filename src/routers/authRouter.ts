//kznj umsc pgvk mlyb

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

export const authRouter = Router({})

authRouter.post('/login', LoginUserMiddleware, async (req: RequestWithBody<AuthType>, res: Response) => {
    const userId = await authService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (!userId) {
        res.sendStatus(401)
        return
    }
    const refreshToken = await jwtService.createJwtRefreshToken(userId)
    res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,})
    const token = await jwtService.createJwtAccessToken(userId, refreshToken)
    res.status(200).send({
        "accessToken": token
    })
})

authRouter.get('/me', UserAuthMiddleware, async (req: Request,  res: Response) => {
    const user = await usersService.findUserById(req.userId!)
    res.send(user)
})

authRouter.post('/registration', ...RegistrationUserMiddleware, async (req: RequestWithBody<UsersInputType>, res: Response)=>{
    await authService.createUser(req.body.login, req.body.password, req.body.email)
    res.sendStatus(204)
})

authRouter.post('/registration-confirmation', ...EmailConfirmationCodeMiddleware, async (req: RequestWithBody<{ code: string }>, res: Response)=>{
    await authService.emailConfirmation(req.body.code)
    res.sendStatus(204)
})

authRouter.post('/registration-email-resending', ...emailResendingMiddleware, async (req: RequestWithBody<{ email: string }>, res: Response) =>{
    await authService.resendEmail(req.body.email)
    res.sendStatus(204)
})

authRouter.post('/refresh-token', async (req: Request, res: Response) =>{
    const oldToken = req.cookies.refreshToken
    const userId = await jwtService.getUserIdByToken(oldToken)
    if (!userId) {
        res.sendStatus(401)
        return
    }
    const token = await jwtService.createJwtAccessToken(userId, oldToken)
    if (!token) {
        res.sendStatus(401)
        return
    }
    await jwtService.addTokenToBlackList(oldToken)
    const refreshToken = await jwtService.createJwtRefreshToken(userId)
    res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,})

    res.status(200).send({
        "accessToken": token
    })
})

authRouter.post('/logout', async (req: Request, res: Response) => {
    const oldToken = req.cookies.refreshToken
    const userId = await jwtService.getUserIdByToken(oldToken)
    if (!userId) {
        res.sendStatus(401)
        return
    }
    await jwtService.addTokenToBlackList(oldToken)
    res.sendStatus(204)
})


