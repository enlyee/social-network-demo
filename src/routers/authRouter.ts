import {Router} from "express";
import {Request, Response} from "express";
import {AuthType, RequestWithBody} from "../models/commonType";
import {usersService} from "../domain/usersService";
import {LoginUserMiddleware} from "../middlewares/loginUserMiddleware";
import {jwtService} from "../application/jwtService";
import {UserAuthMiddleware} from "../middlewares/userAuthMiddleware";

export const authRouter = Router({})

authRouter.post('/login', LoginUserMiddleware, async (req: RequestWithBody<AuthType>, res: Response) => {
    const userId = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (!userId) {
        res.sendStatus(401)
        return
    }

    const token = await jwtService.createJwt(userId)
    res.status(200).send({
        "accessToken": token
    })
})

authRouter.get('/me', UserAuthMiddleware, async (req: Request,  res: Response) => {
    const user = await usersService.findUserById(req.userId!)
    res.send(user)
})