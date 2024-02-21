import {ObjectId} from "mongodb";
import {CommentsDbType, FindParamsCommentsType} from "../models/commentsTypes";
import {CommentModel, LikeDislikeCommentsModel} from "../db/db";

class CommentsRepository {
    async getCommentById(id: string) {
        return CommentModel.findOne({_id: new ObjectId(id)})
    }
    async deleteCommentById(id: string){
        const status = await CommentModel.deleteOne({_id: new ObjectId(id)})
        return !!status.deletedCount
    }
    async updateCommentById(commentId: string, content: string){
        const status = await CommentModel.updateOne({_id: new ObjectId(commentId)},
            {$set: {content: content}})
        return !!status.matchedCount
    }
    async getComments(findParams: FindParamsCommentsType) {
        const collectionSize = (await CommentModel
            .find({postId: findParams.postId})
            .lean()).length
        const comments = await CommentModel
            .find({postId: findParams.postId})
            .sort({[findParams.sortBy]: findParams.sortDirection}).skip((findParams.pageNumber-1)*findParams.pageSize).limit(+findParams.pageSize)
            .lean()
        return {collectionSize, comments}
    }
    async postComment(content: CommentsDbType){
        const comment = await CommentModel.create(content)
        return comment._id
    }
    async likeDislikeComment(status: 'None' | 'Like' | 'Dislike', userId: string, commentId: string) {
        const state = await LikeDislikeCommentsModel.updateOne({$and: [{commentId: commentId}, {userId: userId}]}, {status: status})
        if (!state.matchedCount){
            await LikeDislikeCommentsModel.create({commentId: commentId, userId: userId, status: status})
        }
    }
    async getCommentLikesDislikes(commentId: string){
        const likes = await LikeDislikeCommentsModel.countDocuments({$and: [{commentId: commentId}, {status: 'Like'}]})
        const dislikes = await LikeDislikeCommentsModel.countDocuments({$and: [{commentId: commentId}, {status: 'Dislike'}]})
        console.log(likes, dislikes)
        return {likes, dislikes}
    }
    async getCommentMyStatus(userId: string, commentId: string) {
        const status = await LikeDislikeCommentsModel.findOne({$and: [{userId: userId}, {commentId: commentId}]}).lean()
        if (!status) return 'None'
        return status.status
    }
}
export const commentsRepository = new CommentsRepository()