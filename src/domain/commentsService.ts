import {WithId} from "mongodb";
import {CommentsDbType} from "../models/commentsTypes";
import {UsersService} from "./usersService";
import {PostService} from "./postService";
import {CommentsRepository} from "../repositories/commentsRepository";
import {injectable} from "inversify";
import {PostsQueryRepository} from "../queryRepositories/postsQuery";
import {CommentsQueryRepository} from "../queryRepositories/commentsQuery";
import {Mappers} from "../models/mappers/mappers";

@injectable()
export class CommentsService {

    constructor(protected usersService: UsersService,
                protected postService: PostService,
                protected commentsRepository: CommentsRepository,
                protected postsQueryRepository: PostsQueryRepository,
                protected commentsQueryRepository: CommentsQueryRepository,
                protected mappers: Mappers) {}
    async deleteCommentById(commentId: string, userId: string){
        const comment = await this.commentsQueryRepository.getCommentById(commentId)
        if (!comment) return 404
        const isOwner = comment.commentatorInfo.userId === userId
        if (!isOwner) return 403
        return await this.commentsRepository.deleteCommentById(commentId)
    }
    async updateCommentById(commentId: string, content: string, userId: string){
        const comment = await this.commentsQueryRepository.getCommentById(commentId)
        if (!comment) return 404
        const isOwner = comment.commentatorInfo.userId === userId
        if (!isOwner) return 403
        return await this.commentsRepository.updateCommentById(commentId, content)
    }
    async postComment(postId: string, content: string, userId: string){
        const isExist = await this.postsQueryRepository.getPostById(postId)
        if (!isExist) {
            return 404
        }
        const userLogin = await this.usersService.findUserById(userId)
        const comment: CommentsDbType = {
            content: content,
            commentatorInfo: {
                userId: userId,
                userLogin: userLogin.login
            },
            createdAt: (new Date()).toISOString(),
            postId: postId
        }
        const commentId = await this.commentsRepository.postComment(comment)
        const postedComment: WithId<CommentsDbType> = {
            _id: commentId,
            ...comment
        }
        return this.mappers.commentMapper(postedComment)
    }
    async likeDislikeComment(status: 'None' | 'Like' | 'Dislike', userId: string, commentId: string){
        const comment = await this.commentsQueryRepository.getCommentById(commentId)
        if (!comment) {
            return 404
        }
        await this.commentsRepository.likeDislikeComment(status, userId, commentId)
        return 204
    }
}