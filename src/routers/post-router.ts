import {Request, Response, Router} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../models/commonType";
import {authMiddleware} from "../middlewares/authMiddleware";
import {postRepository} from "../repositories/post-repository";
import {postInputType} from "../models/postsType";
import {inputPostsValidation} from "../middlewares/inputPostsValidation";
export const postRouter = Router({})

postRouter.get('/', async (req: Request, res: Response) => {
    res.send(await postRepository.getPosts())
})
postRouter.get('/:id', async (req: RequestWithParams<{ id: string }>, res: Response) => {
    let post = await postRepository.getPostById(req.params.id)
    if (post) {
        res.send(post)
    } else {
        res.sendStatus(404)
    }
})
postRouter.post('/', authMiddleware, ...inputPostsValidation, async (req: RequestWithBody<postInputType>, res: Response) => {

    let newPost = await postRepository.createPost(req.body)
    res.status(201).send(newPost)
})
postRouter.delete('/:id', authMiddleware, async (req: RequestWithParams<{ id: string }>, res:Response) => {
    if (await postRepository.deletePost(req.params.id)) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})
postRouter.put('/:id', authMiddleware, ...inputPostsValidation, async (req: RequestWithParamsAndBody<{id: string},postInputType>, res: Response) => {
    if (await postRepository.updatePost(req.params.id ,req.body)) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})

