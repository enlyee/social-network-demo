import {
    PostInputType,
    PostsDbType,
    PostsOutputType
} from "../models/postsType";
import {ObjectId} from "mongodb";
import {LikeStatusType} from "../models/commonType";
import {PostModel, PostsLikeDislikeModel} from "../db/db";
import {injectable} from "inversify";
import {Mappers} from "../models/mappers/mappers";

@injectable()
export class PostRepository {
    constructor(protected mappers: Mappers) {
    }
    async createPost(inputPost: PostsDbType): Promise<PostsOutputType | false> {
        const newPost = await PostModel.create(inputPost)
        return this.mappers.postMapper({
            _id: newPost._id,
            ...inputPost
        })
    }
    async deletePost(id: string): Promise<boolean>{
        const ind = await PostModel.deleteOne({_id: new ObjectId(id)})
        return !!ind.deletedCount
    }
    async updatePost(id: string, post: PostInputType){
        return !!(await PostModel.updateOne({id}, {
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId
        })).matchedCount
    }
    async likeDislikePost(postId: string, userId: string, status: LikeStatusType){
        const updateStatus = await PostsLikeDislikeModel.updateOne({$and: [{postId: postId}, {userId: userId}]}, {status: status})
        if (!updateStatus.matchedCount) await PostsLikeDislikeModel.create({postId: postId, userId: userId, status: status, addedAt: new Date()})
    }
}
