import {Request, Response, Router} from "express";
import {
    QueryGetCommentsType,
    QueryGetPostsType,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody, RequestWithParamsAndQuery,
    RequestWithQuery
} from "../models/commonType";
import {adminAuthMiddleware} from "../middlewares/adminAuthMiddleware";
import {PostInputType} from "../models/postsType";
import {InputPostsMiddleware} from "../middlewares/inputPostsMiddleware";
import {postService} from "../domain/postService";
import {ObjectId} from "mongodb";
import {commentsService} from "../domain/commentsService";
import {UserAuthMiddleware} from "../middlewares/userAuthMiddleware";
import {UpdateCommentsMiddleware} from "../middlewares/inputCommentsMiddleware";
export const postRouter = Router({})

postRouter.get('/', async (req: RequestWithQuery<QueryGetPostsType>, res: Response) => {
    //todo: !objectID to validator
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
postRouter.post('/', adminAuthMiddleware, ...InputPostsMiddleware, async (req: RequestWithBody<PostInputType>, res: Response) => {
    const newPost = await postService.createPost(req.body)
    res.status(201).send(newPost)
})
postRouter.delete('/:id', adminAuthMiddleware, async (req: RequestWithParams<{ id: string }>, res:Response) => {
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
postRouter.put('/:id', adminAuthMiddleware, ...InputPostsMiddleware, async (req: RequestWithParamsAndBody<{id: string},PostInputType>, res: Response) => {

    const updateStatus = await postService.updatePost(req.params.id ,req.body);
    if (!updateStatus) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
})

postRouter.get('/:postId/comments', async (req: RequestWithParamsAndQuery<{ postId: string }, QueryGetCommentsType>, res: Response) =>{
    const comments = await commentsService.getComments(req.params.postId, req.query)
    switch (comments){
        case 404:
            res.sendStatus(404)
            break
        default:
            res.send(comments)
    }
})

postRouter.post('/:postId/comments', UserAuthMiddleware, ...UpdateCommentsMiddleware, async (req: RequestWithParamsAndBody<{ postId: string }, {content: string}>, res: Response)=>{
    const comment = await commentsService.postComment(req.params.postId, req.body.content, req.userId!)
    switch (comment) {
        case 404:
            res.sendStatus(404)
            break
        default:
            res.status(201).send(comment)

    }
})

