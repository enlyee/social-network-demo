import {Router} from "express";
import {Request, Response} from "express";
import {AuthType, RequestWithBody} from "../models/commonType";
import {InputUserAuthMiddleware} from "../middlewares/inputUserMiddleware";
import {usersService} from "../domain/usersService";

export const authRouter = Router({})

authRouter.post('/', InputUserAuthMiddleware, async (req: RequestWithBody<AuthType>, res: Response) => {
    const authStatus = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (!authStatus) {
        res.sendStatus(401)
        return
    }
    res.sendStatus(200)
})