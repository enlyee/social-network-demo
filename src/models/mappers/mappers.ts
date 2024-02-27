import {WithId} from "mongodb";
import {NewestLikesType, PostsDbType, PostsLikesDislikesDbType, PostsOutputType} from "../postsType";
import {injectable} from "inversify";
import {BlogsDbType, BlogsOutputType} from "../blogsType";
import {CommentsLikeDislikeModel, PostsLikeDislikeModel} from "../../db/db";
import {UsersRepository} from "../../repositories/usersRepository";
import {CommentsDbType, CommentsViewType} from "../commentsTypes";
import {LikeStatusType} from "../commonType";

@injectable()
export class Mappers {
    constructor(protected usersQueryRepository: UsersRepository) {
    }
    async postMapper(postDb: WithId<PostsDbType>, userId?: string): Promise<PostsOutputType> {

        let status: LikeStatusType
        if (!userId) status = 'None'
        else status = await this.getPostMyStatus(userId, postDb._id.toString())
        const {likes, dislikes} = await this.getPostLikesDislikes(postDb._id.toString())
        const newestLikes = await this.getThreePostLikes(postDb._id.toString())
        const newLikesOutput: NewestLikesType[] = await Promise.all(newestLikes.map(async (like: WithId<PostsLikesDislikesDbType>) => {
            return {
                addedAt: like.addedAt.toISOString(),
                userId: like.userId,
                login: (await this.usersQueryRepository.findUserById(like.userId))!.login
            }
        }))

        return {
            id: postDb._id.toString(),
            title: postDb.title,
            shortDescription: postDb.shortDescription,
            content: postDb.content,
            blogId: postDb.blogId,
            blogName: postDb.blogName,
            createdAt: postDb.createdAt,
            extendedLikesInfo: {
                likesCount: likes,
                dislikesCount: dislikes,
                myStatus: status,
                newestLikes: newLikesOutput
            }
        }
    }
    blogMapper(blogDb: WithId<BlogsDbType>): BlogsOutputType {
        return {
            id: blogDb._id.toString(),
            name: blogDb.name,
            description: blogDb.description,
            websiteUrl: blogDb.websiteUrl,
            createdAt: blogDb.createdAt,
            isMembership: blogDb.isMembership
        }
    }
    async commentMapper(commentsDb: WithId<CommentsDbType>, userId?: string): Promise<CommentsViewType> {
        let status: 'None' | 'Like' | 'Dislike'
        if (!userId) status = 'None'
        else status = await this.getCommentMyStatus(userId, commentsDb._id.toString())
        const {likes, dislikes} = await this.getCommentLikesDislikes(commentsDb._id.toString())
        //map comment -> get comment id ->get statuses  (mongo with massive - $in: )
        return {
            id: commentsDb._id.toString(),
            content: commentsDb.content,
            commentatorInfo: {
                userId: commentsDb.commentatorInfo.userId,
                userLogin: commentsDb.commentatorInfo.userLogin
            },
            createdAt: commentsDb.createdAt,
            likesInfo: {
                likesCount: likes,
                dislikesCount: dislikes,
                myStatus: status
            }
        }
    }

    async getPostMyStatus(userId: string, postId: string) {
        const status = await PostsLikeDislikeModel.findOne({$and: [{userId: userId}, {postId: postId}]}).lean()
        if (!status) return 'None'
        return status.status
    }
    async getPostLikesDislikes(postId: string){
        const likes = await PostsLikeDislikeModel.countDocuments({$and: [{postId: postId}, {status: 'Like'}]})
        const dislikes = await PostsLikeDislikeModel.countDocuments({$and: [{postId: postId}, {status: 'Dislike'}]})
        return {likes, dislikes}
    }
    async getThreePostLikes(postId: string) {
        return PostsLikeDislikeModel.find({$and: [{postId: postId}, {status: 'Like'}]})
            .sort({addedAt: "descending"}).limit(3).lean();
    }


    async getCommentLikesDislikes(commentId: string){
        const likes = await CommentsLikeDislikeModel.countDocuments({$and: [{commentId: commentId}, {status: 'Like'}]})
        const dislikes = await CommentsLikeDislikeModel.countDocuments({$and: [{commentId: commentId}, {status: 'Dislike'}]})
        return {likes, dislikes}
    }
    async getCommentMyStatus(userId: string, commentId: string) {
        const status = await CommentsLikeDislikeModel.findOne({$and: [{userId: userId}, {commentId: commentId}]}).lean()
        if (!status) return 'None'
        return status.status
    }

    //usersSession mappers
}