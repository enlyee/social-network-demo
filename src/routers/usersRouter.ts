import {Router} from "express";
import {adminAuthMiddleware} from "../middlewares/adminAuthMiddleware";
import {RegistrationUserMiddleware} from "../middlewares/registrationUserMiddleware";
import {container} from "../composition-root";
import {UsersController} from "../controllers/usersController";

export const usersRouter = Router({})

const usersController = container.resolve(UsersController)

usersRouter.get('/', adminAuthMiddleware, usersController.getUsers.bind(usersController))

usersRouter.post('/', adminAuthMiddleware, ...RegistrationUserMiddleware, usersController.createUser.bind(usersController))

usersRouter.delete('/:id', adminAuthMiddleware, usersController.deleteUser.bind(usersController))