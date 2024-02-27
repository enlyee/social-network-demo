import {injectable} from "inversify";
import {UsersService} from "../domain/usersService";
import {QueryGetUsersType, RequestWithBody, RequestWithParams, RequestWithQuery} from "../models/commonType";
import {Response} from "express";
import {UsersInputType} from "../models/usersTypes";

@injectable()
export class UsersController {
    constructor(protected usersService: UsersService) {
    }

    async getUsers(req: RequestWithQuery<QueryGetUsersType>, res: Response) {
        const query = req.query
        const users = await this.usersService.findUsers(query)
        res.send(users)
    }

    async createUser(req: RequestWithBody<UsersInputType>, res: Response) {
        const newUser = await this.usersService.createUser(req.body.login, req.body.email, req.body.password)
        res.status(201).send(newUser)
    }

    async deleteUser(req: RequestWithParams<{ id: string }>, res: Response) {
        const status = await this.usersService.deleteUser(req.params.id)
        if (!status) {
            res.sendStatus(404)
            return
        }
        res.sendStatus(204)
    }
}