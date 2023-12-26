import {Router, Request, Response} from "express";
import {blogRepository} from "../repositories/blog-repository";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../models/commonType";
import {blogInputType, blogsOutputType} from "../models/blogsType";
import {newInputBlogsValidation, updateInputBlogsValidation} from "../middlewares/inputBlogsMiddleware";
import {authMiddleware} from "../middlewares/authMiddleware";

export const blogRouter = Router({})

blogRouter.get('/', async (req: Request, res: Response) => {
    res.send(await blogRepository.getBlogs())
})
blogRouter.get('/:id', async (req: RequestWithParams<{ id: string }>, res: Response) => {
    let blog = await blogRepository.getBlogById(req.params.id)
    if (blog) {
        res.send(blog)
    } else {
        res.sendStatus(404)
    }
})
blogRouter.post('/', authMiddleware, ...newInputBlogsValidation, async (req: RequestWithBody<blogInputType>, res: Response) => {

    let newBlog: blogsOutputType = await blogRepository.createBlog(req.body)
    res.status(201).send(newBlog)

})
blogRouter.delete('/:id', authMiddleware, async (req: RequestWithParams<{ id: string }>, res:Response) => {
    if (await blogRepository.deleteBlog(req.params.id)) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})
blogRouter.put('/:id', authMiddleware, ...updateInputBlogsValidation, async (req: RequestWithParamsAndBody<{id: string},blogInputType>, res: Response) => {
    if (await blogRepository.updateBlog(req.params.id ,req.body)) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

