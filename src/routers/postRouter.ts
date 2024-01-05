import {Request, Response, Router} from "express";
import {
    QueryGetPostsType,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithQuery
} from "../models/commonType";
import {authMiddleware} from "../middlewares/authMiddleware";
import {postRepository} from "../repositories/postRepository";
import {PostInputType} from "../models/postsType";
import {InputPostsMiddleware} from "../middlewares/inputPostsMiddleware";
import {postService} from "../domain/postService";
import {ObjectId} from "mongodb";
export const postRouter = Router({})

postRouter.get('/', async (req: RequestWithQuery<QueryGetPostsType>, res: Response) => {
    const query = req.query
    const posts = await postService.getPosts(query)
    res.send(posts)
})
postRouter.get('/:id', async (req: RequestWithParams<{ id: string }>, res: Response) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.sendStatus(404)
        return
    }
    let post = await postService.getPostById(req.params.id)
    if (post) {
        res.send(post)
    } else {
        res.sendStatus(404)
    }
})
postRouter.post('/', authMiddleware, ...InputPostsMiddleware, async (req: RequestWithBody<PostInputType>, res: Response) => {
    const newPost = await postService.createPost(req.body)
    res.status(201).send(newPost)
})
postRouter.delete('/:id', authMiddleware, async (req: RequestWithParams<{ id: string }>, res:Response) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.sendStatus(404)
        return
    }
    const deleteStatus = await postService.deletePost(req.params.id);
    if (!deleteStatus) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
})
postRouter.put('/:id', authMiddleware, ...InputPostsMiddleware, async (req: RequestWithParamsAndBody<{id: string},PostInputType>, res: Response) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.sendStatus(404)
        return
    }
    const updateStatus = await postService.updatePost(req.params.id ,req.body);
    if (!updateStatus) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
})

