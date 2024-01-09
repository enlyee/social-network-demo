import {Router, Request, Response} from "express";
import {adminAuthMiddleware} from "../middlewares/adminAuthMiddleware";
import {QueryGetUsersType, RequestWithBody, RequestWithParams, RequestWithQuery} from "../models/commonType";
import {usersService} from "../domain/usersService";
import {UsersInputType} from "../models/usersTypes";
import {CreatingUserMiddleware} from "../middlewares/inputUserMiddleware";

export const usersRouter = Router({})

usersRouter.get('/', adminAuthMiddleware, async (req: RequestWithQuery<QueryGetUsersType>, res: Response) => {
    const query = req.query
    const users = await usersService.findUsers(query)
    res.send(users)
})

usersRouter.post('/', adminAuthMiddleware, ...CreatingUserMiddleware, async (req: RequestWithBody<UsersInputType>, res: Response)=> {
    const newUser = await usersService.createUser(req.body.login, req.body.email, req.body.password)
    res.status(201).send(newUser)
})

usersRouter.delete('/:id', adminAuthMiddleware, async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const status = await usersService.deleteUser(req.params.id)
    if (!status) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
})