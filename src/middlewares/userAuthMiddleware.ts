import {Request, Response, NextFunction} from "express";
import {jwtService} from "../application/jwtService";

export const UserAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)
        return
    }

    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtService.getUserIdByToken(token)
    if (userId) {
        req.userId = userId.toString()
        next()
        return
    }
    res.sendStatus(401)
}