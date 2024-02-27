import {Router} from "express";
import {InputBlogsMiddleware} from "../middlewares/inputBlogsMiddleware";
import {adminAuthMiddleware} from "../middlewares/adminAuthMiddleware";
import {InputPostsMiddlewareWithoutId} from "../middlewares/inputPostsMiddleware";
import {TryAuthMiddleware} from "../middlewares/userAuthMiddleware";
import {container} from "../composition-root";
import {BlogsController} from "../controllers/blogsController";

export const blogRouter = Router({})

const blogsController = container.resolve(BlogsController)

blogRouter.get('/', blogsController.getAllBlogs.bind(blogsController) )
blogRouter.get('/:id/posts', TryAuthMiddleware, blogsController.getBlogsPosts.bind(blogsController) )
blogRouter.post('/:id/posts', adminAuthMiddleware, ...InputPostsMiddlewareWithoutId, blogsController.createPostToBlog.bind(blogsController) )
blogRouter.get('/:id', blogsController.getBlogById.bind(blogsController) )
blogRouter.post('/', adminAuthMiddleware, ...InputBlogsMiddleware, blogsController.createBlog.bind(blogsController) )
blogRouter.delete('/:id', adminAuthMiddleware, blogsController.deleteBlogById.bind(blogsController) )
blogRouter.put('/:id', adminAuthMiddleware, ...InputBlogsMiddleware, blogsController.editBlog.bind(blogsController) )


