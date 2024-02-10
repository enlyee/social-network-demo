import {ObjectId} from "mongodb";
import {CommentsDbType, FindParamsCommentsType} from "../models/commentsTypes";
import {CommentModel} from "../db/db";

export const commentsRepository = {
    async getCommentById(id: string) {
        return CommentModel.findOne({_id: new ObjectId(id)})
    },
    async deleteCommentById(id: string){
        const status = await CommentModel.deleteOne({_id: new ObjectId(id)})
        return !!status.deletedCount
    },
    async updateCommentById(commentId: string, content: string){
        const status = await CommentModel.updateOne({_id: new ObjectId(commentId)},
            {$set: {content: content}})
        return !!status.matchedCount
    },
    async getComments(findParams: FindParamsCommentsType) {
        const collectionSize = (await CommentModel
            .find({postId: findParams.postId})
            .lean()).length
        const comments = await CommentModel
            .find({postId: findParams.postId})
            .sort({[findParams.sortBy]: findParams.sortDirection}).skip((findParams.pageNumber-1)*findParams.pageSize).limit(+findParams.pageSize)
            .lean()
        return {collectionSize, comments}
    },
    async postComment(content: CommentsDbType){
        const comment = await CommentModel.create(content)
        return comment._id
    }
}