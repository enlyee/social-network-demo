import {Router} from "express";
import {adminAuthMiddleware} from "../middlewares/adminAuthMiddleware";
import {InputPostsMiddleware} from "../middlewares/inputPostsMiddleware";
import {TryAuthMiddleware, UserAuthMiddleware} from "../middlewares/userAuthMiddleware";
import {UpdateCommentsMiddleware} from "../middlewares/inputCommentsMiddleware";
import {LikeStatusMiddleware} from "../middlewares/likeStatusMiddleware";
import {container} from "../composition-root";
import {PostsController} from "../controllers/postsController";

export const postsRouter = Router({})

const postsController = container.resolve(PostsController)

postsRouter.get('/', TryAuthMiddleware, postsController.getAllPosts.bind(postsController) )

postsRouter.get('/:id', TryAuthMiddleware, postsController.getPostById.bind(postsController) )

postsRouter.post('/', adminAuthMiddleware, ...InputPostsMiddleware, postsController.createPost.bind(postsController) )

postsRouter.delete('/:id', adminAuthMiddleware, postsController.deletePostById.bind(postsController) )

postsRouter.put('/:id', adminAuthMiddleware, ...InputPostsMiddleware, postsController.updatePostById.bind(postsController) )

postsRouter.get('/:postId/comments', TryAuthMiddleware, postsController.getPostComments.bind(postsController) )

postsRouter.post('/:postId/comments', UserAuthMiddleware, ...UpdateCommentsMiddleware, postsController.createCommentToPost.bind(postsController) )

postsRouter.put('/:postId/like-status', UserAuthMiddleware, ...LikeStatusMiddleware, postsController.likeDislikePost.bind(postsController) )
