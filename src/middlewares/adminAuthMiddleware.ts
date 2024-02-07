import {NextFunction, Request, Response} from "express";
import dotenv from "dotenv";
dotenv.config()
const adminLogin = process.env.ADMIN_LOGIN || 'admin'
const adminPass = process.env.ADMIN_PASS || 'qwerty'
export const adminAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        res.sendStatus(401)
        return
    }
    const inputAuthKey = authHeader.split(' ')[1]
    const serverAuthKey = btoa(adminLogin + ':' + adminPass)
    console.log(inputAuthKey, serverAuthKey)
    if (inputAuthKey !== serverAuthKey) {
        res.sendStatus(401)
        return
    }
    next()
}

