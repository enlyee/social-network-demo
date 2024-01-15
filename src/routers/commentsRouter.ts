import {Router, Request, Response} from "express";
import {RequestWithParams, RequestWithParamsAndBody} from "../models/commonType";
import {commentsService} from "../domain/commentsService";
import {UserAuthMiddleware} from "../middlewares/userAuthMiddleware";
import {UpdateCommentsMiddleware} from "../middlewares/inputCommentsMiddleware";

export const commentsRouter = Router({})

commentsRouter.get('/:id', async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const comment = await commentsService.getCommentById(req.params.id)
    if (!comment) {
        res.sendStatus(404)
        return
    }
    res.send(comment)
})

commentsRouter.delete('/:id', UserAuthMiddleware, async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const isExist = await commentsService.getCommentById(req.params.id)
    if (!isExist) {
        res.sendStatus(404)
        return
    }
    const isOwner = await commentsService.checkCommentOwner(req.params.id, req.userId!);
    if (!isOwner){
        res.sendStatus(403)
        return
    }
    const status = await commentsService.deleteCommentById(req.params.id)
    if (!status) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
})

commentsRouter.put('/:id', UserAuthMiddleware, ...UpdateCommentsMiddleware, async (req: RequestWithParamsAndBody<{ id: string }, {content: string}>, res: Response) => {
    const isExist = await commentsService.getCommentById(req.params.id)
    if (!isExist) {
        res.sendStatus(404)
        return
    }
    const isOwner = await commentsService.checkCommentOwner(req.params.id, req.userId!);
    if (!isOwner){
        res.sendStatus(403)
        return
    }
    const status = await commentsService.updateCommentById(req.params.id, req.body.content)
    if (!status) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
})

