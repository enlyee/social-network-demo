import {Router, Request, Response} from "express";
import {RequestWithParams, RequestWithParamsAndBody} from "../models/commonType";
import {commentsService} from "../domain/commentsService";
import {UserAuthMiddleware} from "../middlewares/userAuthMiddleware";
import {UpdateCommentsMiddleware} from "../middlewares/inputCommentsMiddleware";

export const commentsRouter = Router({})

commentsRouter.get('/:id', async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const comment = await commentsService.getCommentById(req.params.id)
    switch (comment) {
        case false:
            res.sendStatus(404)
            break
        default:
            res.send(comment)

    }

})

commentsRouter.delete('/:id', UserAuthMiddleware, async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const result = await commentsService.deleteCommentById(req.params.id, req.userId!)
    switch (result) {
        case 404 | 403:
            res.sendStatus(result)
            break
        default:
            res.status(204)

    }

})

commentsRouter.put('/:id', UserAuthMiddleware, ...UpdateCommentsMiddleware, async (req: RequestWithParamsAndBody<{ id: string }, {content: string}>, res: Response) => {
    const result = await commentsService.updateCommentById(req.params.id, req.body.content, req.userId!)
    switch (result) {
        case 404 | 403:
            res.sendStatus(result)
            break
        default:
            res.status(204)

    }
})

