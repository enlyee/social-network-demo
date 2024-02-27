import {PostService} from "../domain/postService";
import {CommentsService} from "../domain/commentsService";
import {
    LikeStatusType,
    QueryGetCommentsType,
    QueryGetPostsType,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../models/commonType";
import {Response} from "express";
import {PostInputType} from "../models/postsType";
import {injectable} from "inversify";
import {PostsQueryRepository} from "../queryRepositories/postsQuery";
import {CommentsQueryRepository} from "../queryRepositories/commentsQuery";
@injectable()
export class PostsController {
    constructor(protected postService: PostService,
                protected commentsService: CommentsService,
                protected queryPostRepository: PostsQueryRepository,
                protected commentsQueryRepository: CommentsQueryRepository) {
    }

    async getAllPosts(req: RequestWithQuery<QueryGetPostsType>, res: Response) {
        const query = req.query
        const posts = await this.queryPostRepository.getPosts(query, req.userId)
        res.send(posts)
    }

    async getPostById(req: RequestWithParams<{ id: string }>, res: Response) {
        const post = await this.queryPostRepository.getPostById(req.params.id, req.userId)
        if (!post) {
            res.sendStatus(404)
            return
        }
        res.send(post)
    }

    async createPost(req: RequestWithBody<PostInputType>, res: Response) {
        const newPost = await this.postService.createPost(req.body)
        res.status(201).send(newPost)
    }

    async updatePostById(req: RequestWithParamsAndBody<{ id: string }, PostInputType>, res: Response) {
        const updateStatus = await this.postService.updatePost(req.params.id, req.body);
        if (!updateStatus) {
            res.sendStatus(404)
            return
        }
        res.sendStatus(204)
    }

    async deletePostById(req: RequestWithParamsAndBody<{ id: string }, PostInputType>, res: Response) {
        const deleteStatus = await this.postService.deletePost(req.params.id);
        if (!deleteStatus) {
            res.sendStatus(404)
            return
        }
        res.sendStatus(204)
    }

    async getPostComments(req: RequestWithParamsAndQuery<{ postId: string }, QueryGetCommentsType>, res: Response) {
        const comments = await this.commentsQueryRepository.getComments(req.params.postId, req.query, req.userId)
        switch (comments) {
            case 404:
                res.sendStatus(404)
                break
            default:
                res.send(comments)
        }
    }

    async createCommentToPost(req: RequestWithParamsAndBody<{ postId: string }, { content: string }>, res: Response) {
        const comment = await this.commentsService.postComment(req.params.postId, req.body.content, req.userId!)
        switch (comment) {
            case 404:
                res.sendStatus(404)
                break
            default:
                res.status(201).send(comment)
        }
    }

    async likeDislikePost(req: RequestWithParamsAndBody<{ postId: string }, {likeStatus: LikeStatusType}>, res: Response) {
        const result = await this.postService.likeDislikePost(req.params.postId, req.userId!, req.body.likeStatus)
        if (!result) {
            res.sendStatus(404)
            return
        }
        res.sendStatus(204)
    }
}