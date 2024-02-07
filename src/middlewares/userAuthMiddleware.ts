import {Request, Response, NextFunction} from "express";
import {jwtAdapter} from "../adapters/jwtAdapter";

export const UserAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)
        return
    }

    const token = req.headers.authorization.split(' ')[1]

    const userId = (await jwtAdapter.getTokenPayload(token)).userId
    if (userId) {
        req.userId = userId.toString()
        next()
        return
    }
    res.sendStatus(401)
}