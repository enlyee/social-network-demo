import {commentsRepository} from "../repositories/commentsRepository";
import {ObjectId, WithId} from "mongodb";
import {QueryGetCommentsType} from "../models/commonType";
import {CommentsDbType, FindParamsCommentsType} from "../models/commentsTypes";
import {CommentsMapper} from "../models/mappers/commentsMapper";
import {usersService} from "./usersService";
import {postService} from "./postService";
const sortingCommentsName = ['createdAt', 'id']

class CommentsService {
    async getCommentById(commentId: string, userId?: string) {
        if (!ObjectId.isValid(commentId)) {
            return false
        }
        const comment = await commentsRepository.getCommentById(commentId)
        if (!comment) {
            return false
        }
        if (!userId) return CommentsMapper(comment)
        return CommentsMapper(comment, userId)
    }
    async deleteCommentById(commentId: string, userId: string){
        const comment = await this.getCommentById(commentId)
        if (!comment) {
            return 404
        }
        const isOwner = comment.commentatorInfo.userId === userId
        if (!isOwner){
            return 403
        }
        const status = await commentsRepository.deleteCommentById(commentId)
        return status
    }
    async checkCommentOwner(commentId: string, userId: string) {
        const comment: any = await commentsRepository.getCommentById(commentId)
        return userId === comment.commentatorInfo.userId
    }
    async updateCommentById(commentId: string, content: string, userId: string){
        const comment = await this.getCommentById(commentId)
        if (!comment) {
            return 404
        }
        const isOwner = comment.commentatorInfo.userId === userId
        if (!isOwner){
            return 403
        }
        const status = await commentsRepository.updateCommentById(commentId, content)
        return status
    }
    async getComments(postId: string, query: QueryGetCommentsType, userId?: string) {
        const isExist = await postService.getPostById(postId)
        if (!isExist) {
            return 404
        }
        const findParams: FindParamsCommentsType = {
            sortBy: (query.sortBy) ? (sortingCommentsName.includes(query.sortBy)) ? (query.sortBy) : 'createdAt' : 'createdAt',
            sortDirection: query.sortDirection || 'desc',
            pageNumber: query.pageNumber || 1,
            pageSize: query.pageSize || 10,
            postId: postId
        }
        const {collectionSize, comments} = await commentsRepository.getComments(findParams)

        return {
            pagesCount: Math.ceil(collectionSize/findParams.pageSize),
            page: +findParams.pageNumber,
            pageSize: +findParams.pageSize,
            totalCount: collectionSize,
            items: Promise.all(comments.map(comments => CommentsMapper(comments, userId)))
        }
    }
    async postComment(postId: string, content: string, userId: string){
        const isExist = await postService.getPostById(postId)
        if (!isExist) {
            return 404
        }
        const userLogin = await usersService.findUserById(userId)
        const comment: CommentsDbType = {
            content: content,
            commentatorInfo: {
                userId: userId,
                userLogin: userLogin.login
            },
            createdAt: (new Date()).toISOString(),
            postId: postId
        }
        const commentId = await commentsRepository.postComment(comment)
        const postedComment: WithId<CommentsDbType> = {
            _id: commentId,
            ...comment
        }
        return CommentsMapper(postedComment)
    }
    async likeDislikeComment(status: 'None' | 'Like' | 'Dislike', userId: string, commentId: string){
        const comment = await this.getCommentById(commentId)
        if (!comment) {
            return 404
        }
        await commentsRepository.likeDislikeComment(status, userId, commentId)
        return 204
    }
}
export const commentsService = new CommentsService()