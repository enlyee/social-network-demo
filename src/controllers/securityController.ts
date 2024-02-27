import {SecurityService} from "../domain/securityService";
import {Request, Response} from "express";
import {jwtAdapter} from "../adapters/jwtAdapter";
import {RequestWithParams} from "../models/commonType";
import {injectable} from "inversify";
@injectable()
export class SecurityController {
    constructor(protected securityService: SecurityService) {
    }

    async getSessions(req: Request, res: Response) {
        //todo: 10 and 15 to service. Get token payload to middleware
        const refreshToken = req.cookies.refreshToken
        const tokenContains = await jwtAdapter.getTokenPayload(refreshToken)
        if (!tokenContains) {
            res.sendStatus(401)
            return
        }
        const allSessions = await this.securityService.getAllDevices(tokenContains.userId)
        res.send(allSessions)
    }

    async deleteAllSessions(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        const tokenContains = await jwtAdapter.getTokenPayload(refreshToken)
        if (!tokenContains) {
            res.sendStatus(401)
            return
        }
        await this.securityService.deleteAllSessionsExcludeThis(tokenContains.userId, tokenContains.deviceId)
        res.sendStatus(204)
    }

    async deleteSessionById(req: RequestWithParams<{ deviceId: string }>, res: Response) {
        const refreshToken = req.cookies.refreshToken
        const tokenContains = await jwtAdapter.getTokenPayload(refreshToken)
        if (!tokenContains) {
            res.sendStatus(401)
            return
        }
        const status = await this.securityService.deleteSession(tokenContains.userId, req.params.deviceId)
        switch (status) {
            case 403:
                res.sendStatus(403)
                break
            case 404:
            case false:
                res.sendStatus(404)
                break
            default:
                res.sendStatus(204)
        }

    }
}