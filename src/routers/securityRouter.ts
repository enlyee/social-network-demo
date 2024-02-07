import {Router, Request, Response} from "express";
import {securityService} from "../domain/securityService";
import {RequestWithParams} from "../models/commonType";
import {jwtAdapter} from "../adapters/jwtAdapter";

export const securityRouter = Router({})

securityRouter.get('/devices', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    const tokenContains = await jwtAdapter.getTokenPayload(refreshToken)
    if (!tokenContains) {
        res.sendStatus(401)
        return
    }
    const allSessions = await securityService.getAllDevices(tokenContains.userId)
    res.send(allSessions)
})

securityRouter.delete('/devices', async (req: Request, res: Response)=> {
    const refreshToken = req.cookies.refreshToken
    const tokenContains = await jwtAdapter.getTokenPayload(refreshToken)
    if (!tokenContains) {
        res.sendStatus(401)
        return
    }
    await securityService.deleteAllSessionsExcludeThis(tokenContains.userId, tokenContains.deviceId)
    res.sendStatus(204)
})

securityRouter.delete('/devices/:deviceId', async (req: RequestWithParams<{ deviceId: string }>, res: Response)=> {
    const refreshToken = req.cookies.refreshToken
    const tokenContains = await jwtAdapter.getTokenPayload(refreshToken)
    if (!tokenContains) {
        res.sendStatus(401)
        return
    }
    const status = await securityService.deleteSession(tokenContains.userId, req.params.deviceId)
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

})