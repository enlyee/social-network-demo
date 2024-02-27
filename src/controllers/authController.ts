import {AuthService} from "../domain/authService";
import {UsersService} from "../domain/usersService";
import {JwtService} from "../application/jwtService";
import {AuthType, RequestWithBody} from "../models/commonType";
import {Request, Response} from "express";
import {UsersInputType} from "../models/usersTypes";
import {jwtAdapter} from "../adapters/jwtAdapter";
import {injectable} from "inversify";
@injectable()
export class AuthController {
    constructor(protected authService: AuthService, protected usersService: UsersService, protected jwtService: JwtService) {
    }

    async loginUser(req: RequestWithBody<AuthType>, res: Response) {
        //todo ?????????????/
        const userId = await this.authService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (!userId) {
            res.sendStatus(401)
            return
        }
        const refreshToken = await this.jwtService.createLoginJwtRefreshToken(userId, req.ip!, req.headers["user-agent"] || 'Unknown')
        const token = await this.jwtService.createJwtAccessToken(userId)
        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,})
        res.status(200).send({
            "accessToken": token
        })
    }

    async getUserInfo(req: Request, res: Response) {
        const user = await this.usersService.findUserById(req.userId!)
        res.send(user)
    }

    async registerUser(req: RequestWithBody<UsersInputType>, res: Response) {
        await this.authService.createUser(req.body.login, req.body.password, req.body.email)
        res.sendStatus(204)
    }

    async confirmEmail(req: RequestWithBody<{ code: string }>, res: Response) {
        await this.authService.emailConfirmation(req.body.code)
        res.sendStatus(204)
    }

    async resendEmail(req: RequestWithBody<{ email: string }>, res: Response) {
        await this.authService.resendEmail(req.body.email)
        res.sendStatus(204)
    }

    async updateTokens(req: Request, res: Response) {
        //todo ?????????????/
        const oldToken = req.cookies.refreshToken
        const decToken = await jwtAdapter.getTokenPayload(oldToken)
        if (!decToken) {
            res.sendStatus(401)
            return
        }
        const refreshToken = await this.jwtService.updateJwtRefreshToken(decToken.userId, decToken.deviceId, (await jwtAdapter.getTokenIssuing(oldToken))!)
        if (!refreshToken) {
            res.sendStatus(401)
            return
        }
        const token = await this.jwtService.createJwtAccessToken(decToken.userId)
        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,})
        res.status(200).send({
            "accessToken": token
        })
    }

    async logoutUser(req: Request, res: Response) {
        //todo ?????????????/
        const oldToken = req.cookies.refreshToken
        const tokenInfo = await jwtAdapter.getTokenPayload(oldToken)
        if (!tokenInfo) {
            res.sendStatus(401)
            return
        }
        const deletingSessionStatus = await this.authService.deleteSession(tokenInfo.userId, tokenInfo.deviceId, (await jwtAdapter.getTokenIssuing(oldToken))!)
        if (!deletingSessionStatus) {
            res.sendStatus(401)
            return
        }
        res.sendStatus(204)
    }

    async recoveryPassword(req: RequestWithBody<{ email: string }>, res: Response) {
        const email = req.body.email
        await this.authService.sendPasswordRecoveryEmail(email)
        res.sendStatus(204)
    }

    async changePassword(req: RequestWithBody<{ newPassword: string, recoveryCode: string }>, res: Response) {
        await this.authService.setNewPasswordToUser(req.body.recoveryCode, req.body.newPassword)
        res.sendStatus(204)
    }
}