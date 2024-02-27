import {ObjectId} from "mongodb";
import {CommentsDbType} from "../models/commentsTypes";
import {CommentModel, CommentsLikeDislikeModel} from "../db/db";
import {injectable} from "inversify";
@injectable()
export class CommentsRepository {
    async deleteCommentById(id: string){
        const status = await CommentModel.deleteOne({_id: new ObjectId(id)})
        return !!status.deletedCount
    }
    async updateCommentById(commentId: string, content: string){
        const status = await CommentModel.updateOne({_id: new ObjectId(commentId)},
            {$set: {content: content}})
        return !!status.matchedCount
    }
    async postComment(content: CommentsDbType){
        const comment = await CommentModel.create(content)
        return comment._id
    }
    async likeDislikeComment(status: 'None' | 'Like' | 'Dislike', userId: string, commentId: string) {
        const state = await CommentsLikeDislikeModel.updateOne({$and: [{commentId: commentId}, {userId: userId}]}, {status: status})
        if (!state.matchedCount){
            await CommentsLikeDislikeModel.create({commentId: commentId, userId: userId, status: status})
        }
    }
}