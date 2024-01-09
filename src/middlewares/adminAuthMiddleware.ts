import {NextFunction, Request, Response} from "express";

export const adminAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authKey = req.headers.authorization
    if (authKey !== 'Basic YWRtaW46cXdlcnR5') {
        res.sendStatus(401)
        return
    }
    next()
}

