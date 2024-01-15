import {commentsRepository} from "../repositories/commentsRepository";
import {ObjectId, WithId} from "mongodb";
import {FindParamsUsersType} from "../models/usersTypes";
import {usersRepository} from "../repositories/usersRepository";
import {UsersFindManyMapper} from "../models/mappers/usersMapper";
import {QueryGetCommentsType} from "../models/commonType";
import {CommentsDbType, CommentsDtoType, FindParamsCommentsType} from "../models/commentsTypes";
import {CommentsMapper} from "../models/mappers/commentsMapper";
import {usersService} from "./usersService";
const sortingCommentsName = ['createdAt', 'id']

export const commentsService = {
    async getCommentById(id: string) {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const comment = await commentsRepository.getCommentById(id)
        if (!comment) {
            return false
        }
        return CommentsMapper(comment)
    },
    async deleteCommentById(commentId: string){
        const status = await commentsRepository.deleteCommentById(commentId)
        return status
    },
    async checkCommentOwner(commentId: string, userId: string) {
        const comment: any = await commentsRepository.getCommentById(commentId)
        return userId === comment.commentatorInfo.userId
    },
    async updateCommentById(commentId: string, content: string){
        const status = await commentsRepository.updateCommentById(commentId, content)
        return status
    },
    async getComments(postId: string, query: QueryGetCommentsType) {
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
            items: comments.map(CommentsMapper)
        }
    },
    async postComment(postId: string, content: string, userId: string){
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
}