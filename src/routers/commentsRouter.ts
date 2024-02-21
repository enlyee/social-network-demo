import {Router, Request, Response} from "express";
import {RequestWithParams, RequestWithParamsAndBody} from "../models/commonType";
import {commentsService} from "../domain/commentsService";
import {TryAuthMiddleware, UserAuthMiddleware} from "../middlewares/userAuthMiddleware";
import {UpdateCommentsMiddleware} from "../middlewares/inputCommentsMiddleware";
import {CommentsViewType} from "../models/commentsTypes";
import {LikeStatusMiddleware} from "../middlewares/likeStatusMiddleware";

export const commentsRouter = Router({})

commentsRouter.get('/:id', TryAuthMiddleware, async (req: RequestWithParams<{ id: string }>, res: Response) => {
    let comment: false | CommentsViewType
    if (!req.userId) comment = await commentsService.getCommentById(req.params.id)
    else comment = await commentsService.getCommentById(req.params.id, req.userId)
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
        case 404:
        case 403:
            res.sendStatus(result)
            break
        default:
            res.sendStatus(204)

    }

})

commentsRouter.put('/:id', UserAuthMiddleware, ...UpdateCommentsMiddleware, async (req: RequestWithParamsAndBody<{ id: string }, {content: string}>, res: Response) => {
    const result = await commentsService.updateCommentById(req.params.id, req.body.content, req.userId!)
    switch (result) {
        case 404:
        case 403:
            res.sendStatus(result)
            break
        default:
            res.sendStatus(204)

    }
})

commentsRouter.put('/:id/like-status', UserAuthMiddleware, ...LikeStatusMiddleware, async (req: RequestWithParamsAndBody<{ id: string }, {likeStatus: 'None' | 'Like' | 'Dislike'}>, res: Response) =>{
    const result = await commentsService.likeDislikeComment(req.body.likeStatus, req.userId!, req.params.id)
    switch (result) {
        case 404:
            res.sendStatus(404)
            break
        default:
            res.sendStatus(204)

    }
})
