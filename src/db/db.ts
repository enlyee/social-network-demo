import {WithId} from "mongodb";
import {PostsDbType, PostsLikesDislikesDbType} from "../models/postsType";
import {BlogsDbType} from "../models/blogsType";
import dotenv from 'dotenv'
import {EmailConfirmationType, UsersDbType} from "../models/usersTypes";
import {CommentsDbType, LikesDislikesDbType} from "../models/commentsTypes";
import {AuthSessionsType, PasswordRecoveryType, RateLimitIpType} from "../models/authTypes";
import * as mongoose from "mongoose";
import {
    BlogSchema,
    CommentSchema,
    DeviceAuthSessionSchema,
    EmailConfirmationSchema, PasswordRecoverySchema,
    PostSchema, RateLimitIpSchema,
    UserSchema, CommentLikeDislikeSchema, PostLikeDislikesSchema
} from "./mongooseSchemes";
dotenv.config()


const url = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
console.log('url: ', url)

export const PostModel = mongoose.model<WithId<PostsDbType>>('posts', PostSchema)
export const BlogModel = mongoose.model<WithId<BlogsDbType>>('blogs', BlogSchema)
export const UserModel = mongoose.model<WithId<UsersDbType>>('users', UserSchema)
export const CommentModel = mongoose.model<WithId<CommentsDbType>>('comments', CommentSchema)
export const EmailConfirmationModel = mongoose.model<WithId<EmailConfirmationType>>('emailConfirmations', EmailConfirmationSchema)
export const DeviceAuthSessionModel = mongoose.model<WithId<AuthSessionsType>>('deviceAuthSessions', DeviceAuthSessionSchema)
export const RateLimitIpModel = mongoose.model<WithId<RateLimitIpType>>('rateLimitIps', RateLimitIpSchema)
export const PasswordRecoveryModel = mongoose.model<WithId<PasswordRecoveryType>>('passwordRecoveries', PasswordRecoverySchema)

export const CommentsLikeDislikeModel = mongoose.model<WithId<LikesDislikesDbType>>('likesDislikesComments', CommentLikeDislikeSchema)
export const PostsLikeDislikeModel = mongoose.model<WithId<PostsLikesDislikesDbType>>('likesDislikesPosts', PostLikeDislikesSchema)

///----------without mongoose--------------
//export const postsCollection = client.db().collection<PostsDbType>('posts')
//export const blogsCollection = client.db().collection<BlogsDbType>('blogs')
//export const usersCollection = client.db().collection<UsersDbType>('users')
//export const commentsCollection = client.db().collection<CommentsDbType>('comments')
//export const emailConfirmationCollection = client.db().collection<EmailConfirmationType>('emailConfirmations')
//export const rateLimitIpCollection = client.db().collection<RateLimitIpType>('rateLimitIp')
//export const deviceAuthSessionsCollection = client.db().collection<AuthSessionsType>('deviceAuthSessions')

export async function runDb() {
    try {
        await mongoose.connect(url)
        console.log('it is ok')
    } catch (e) {
        console.log('no connection')
        await mongoose.disconnect()
    }
}