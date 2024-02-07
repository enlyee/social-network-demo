import {commentsCollection} from "../db/db";
import {ObjectId} from "mongodb";
import {CommentsDbType, FindParamsCommentsType} from "../models/commentsTypes";

export const commentsRepository = {
    async getCommentById(id: string) {
        return await commentsCollection.findOne({_id: new ObjectId(id)})
    },
    async deleteCommentById(id: string){
        const status = await commentsCollection.deleteOne({_id: new ObjectId(id)})
        return !!status.deletedCount
    },
    async updateCommentById(commentId: string, content: string){
        const status = await commentsCollection.updateOne({_id: new ObjectId(commentId)},
            {$set: {content: content}})
        return !!status.matchedCount
    },
    async getComments(findParams: FindParamsCommentsType) {
        const collectionSize = (await commentsCollection
            .find({postId: findParams.postId})
            .toArray()).length
        const comments = await commentsCollection
            .find({postId: findParams.postId})
            .sort(findParams.sortBy, findParams.sortDirection).skip((findParams.pageNumber-1)*findParams.pageSize).limit(+findParams.pageSize)
            .toArray()
        return {collectionSize, comments}
    },
    async postComment(content: CommentsDbType){
        const comment = await commentsCollection.insertOne(content)
        return comment.insertedId
    }
}