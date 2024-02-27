import {Router} from "express";
import {TryAuthMiddleware, UserAuthMiddleware} from "../middlewares/userAuthMiddleware";
import {UpdateCommentsMiddleware} from "../middlewares/inputCommentsMiddleware";
import {LikeStatusMiddleware} from "../middlewares/likeStatusMiddleware";
import {container} from "../composition-root";
import {CommentsController} from "../controllers/commentsController";

export const commentsRouter = Router({})

const commentsController = container.resolve(CommentsController)

commentsRouter.get('/:id', TryAuthMiddleware, commentsController.getCommentById.bind(commentsController) )

commentsRouter.delete('/:id', UserAuthMiddleware, commentsController.deleteCommentById.bind(commentsController) )

commentsRouter.put('/:id', UserAuthMiddleware, ...UpdateCommentsMiddleware, commentsController.editCommentById.bind(commentsController) )

commentsRouter.put('/:id/like-status', UserAuthMiddleware, ...LikeStatusMiddleware, commentsController.likeComment.bind(commentsController) )
