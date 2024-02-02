import {Router, Request, Response} from "express";
import {jwtService} from "../application/jwtService";
import {securityService} from "../domain/securityService";
import {RequestWithParams} from "../models/commonType";

export const securityRouter = Router({})

securityRouter.get('/devices', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    const tokenContains = await jwtService.getUserIdAndDeviceByToken(refreshToken)
    if (!tokenContains) {
        res.sendStatus(401)
    }
    const allSessions = await securityService.getAllDevices(tokenContains.userId)
    res.send(allSessions)
})

securityRouter.delete('/devices', async (req: Request, res: Response)=> {
    const refreshToken = req.cookies.refreshToken
    const tokenContains = await jwtService.getUserIdAndDeviceByToken(refreshToken)
    if (!tokenContains) {
        res.sendStatus(401)
    }
    const status = await securityService.deleteAllSessionsExcludeThis(tokenContains.userId, tokenContains.deviceId)
    if (!status) {
        res.sendStatus(401)
    }
    res.sendStatus(204)
})

securityRouter.delete('/devices/:deviceId', async (req: RequestWithParams<{ deviceId: string }>, res: Response)=> {
    const refreshToken = req.cookies.refreshToken
    const tokenContains = await jwtService.getUserIdAndDeviceByToken(refreshToken)
    if (!tokenContains) {
        res.sendStatus(401)
    }
    const status = await securityService.deleteSession(tokenContains.userId, req.params.deviceId)
    if (!status) {
        res.sendStatus(401)
    }
    res.sendStatus(204)
})