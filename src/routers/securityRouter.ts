import {Router} from "express";
import {container} from "../composition-root";
import {SecurityController} from "../controllers/securityController";

export const securityRouter = Router({})

const securityController = container.resolve(SecurityController)

securityRouter.get('/devices', securityController.getSessions.bind(securityController) )

securityRouter.delete('/devices', securityController.deleteAllSessions.bind(securityController))

securityRouter.delete('/devices/:deviceId', securityController.deleteSessionById.bind(securityController))