import {CommentsService} from "../domain/commentsService";
import {LikeStatusType, RequestWithParams, RequestWithParamsAndBody} from "../models/commonType";
import {Response} from "express";
import {injectable} from "inversify";
import {CommentsQueryRepository} from "../queryRepositories/commentsQuery";
@injectable()
export class CommentsController {
    constructor(protected commentsService: CommentsService,
                protected commentsQueryRepository: CommentsQueryRepository) {
    }

    async getCommentById(req: RequestWithParams<{ id: string }>, res: Response) {
        const comment = await this.commentsQueryRepository.getCommentById(req.params.id, req.userId)
        switch (comment) {
            case false:
                res.sendStatus(404)
                break
            default:
                res.send(comment)
        }
    }

    async deleteCommentById(req: RequestWithParams<{ id: string }>, res: Response) {
        const result = await this.commentsService.deleteCommentById(req.params.id, req.userId!)
        switch (result) {
            case 404:
                res.sendStatus(404)
                break
            case 403:
                res.sendStatus(403)
                break
            default:
                res.sendStatus(204)
        }
    }

    async editCommentById(req: RequestWithParamsAndBody<{ id: string }, { content: string }>, res: Response) {
        const result = await this.commentsService.updateCommentById(req.params.id, req.body.content, req.userId!)
        switch (result) {
            case 404:
            case 403:
                res.sendStatus(result)
                break
            default:
                res.sendStatus(204)
        }
    }

    async likeComment(req: RequestWithParamsAndBody<{ id: string }, { likeStatus: LikeStatusType }>, res: Response) {
        const result = await this.commentsService.likeDislikeComment(req.body.likeStatus, req.userId!, req.params.id)
        switch (result) {
            case 404:
                res.sendStatus(404)
                break
            default:
                res.sendStatus(204)
        }
    }
}