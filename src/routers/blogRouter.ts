import {Router, Request, Response} from "express";
import {
    QueryGetBlogsType,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody, RequestWithParamsAndQuery,
    RequestWithQuery
} from "../models/commonType";
import {BlogInputType, BlogsOutputType} from "../models/blogsType";
import {InputBlogsMiddleware} from "../middlewares/inputBlogsMiddleware";
import {authMiddleware} from "../middlewares/authMiddleware";
import {blogService} from "../domain/blogService";
import {postService} from "../domain/postService";
import {InputPostsMiddleware, InputPostsMiddlewareWithoutId} from "../middlewares/inputPostsMiddleware";
import {PostInputTypeWithoutId} from "../models/postsType";
import {ObjectId} from "mongodb";

export const blogRouter = Router({})

blogRouter.get('/', async (req: RequestWithQuery<QueryGetBlogsType>, res: Response) => {
    const query: QueryGetBlogsType = req.query
    const blogs = await blogService.getBlogs(query)
    res.send(blogs)
})

blogRouter.get('/:id/posts', async (req: RequestWithParamsAndQuery<{ id: string }, QueryGetBlogsType>, res: Response) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.sendStatus(404)
        return
    }
    const blog = await blogService.getBlogById(req.params.id)
    if (!blog) {
        res.sendStatus(404)
        return
    }
    let posts = await blogService.findPostsByBlogId(req.params.id, req.query)
    res.status(200).send(posts)
})

blogRouter.post('/:id/posts', authMiddleware, ...InputPostsMiddlewareWithoutId, async (req: RequestWithParamsAndBody<{id: string}, PostInputTypeWithoutId>, res: Response)=> {
    if (!ObjectId.isValid(req.params.id)) {
        res.sendStatus(404)
        return
    }
    const newPost = await blogService.createPostByBlogId(req.params.id, req.body)
    if (!newPost) {
        res.sendStatus(404)
    }
    res.status(201).send(newPost)
})
blogRouter.get('/:id', async (req: RequestWithParams<{ id: string }>, res: Response) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.sendStatus(404)
        return
    }
    const blog = await blogService.getBlogById(req.params.id)

    if (!blog) {
        res.sendStatus(404)
        return
    }
    res.send(blog)
})
blogRouter.post('/', authMiddleware, ...InputBlogsMiddleware, async (req: RequestWithBody<BlogInputType>, res: Response) => {

    const newBlog: BlogsOutputType = await blogService.createBlog(req.body)
    res.status(201).send(newBlog)

})



blogRouter.delete('/:id', authMiddleware, async (req: RequestWithParams<{ id: string }>, res:Response) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.sendStatus(404)
        return
    }
    const delStatus = await blogService.deleteBlog(req.params.id)
    if (!delStatus) {
        res.sendStatus(404)
    }
    res.sendStatus(204)
})
blogRouter.put('/:id', authMiddleware, ...InputBlogsMiddleware, async (req: RequestWithParamsAndBody<{id: string},BlogInputType>, res: Response) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.sendStatus(404)
        return
    }
    const putStatus = await blogService.updateBlog(req.params.id ,req.body);
    if (!putStatus) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)

})


