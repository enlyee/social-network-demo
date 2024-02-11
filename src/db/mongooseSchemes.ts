import mongoose from "mongoose";
import {PostsDbType} from "../models/postsType";
import {BlogsDbType} from "../models/blogsType";
import {WithId} from "mongodb";
import {EmailConfirmationType, UsersDbType} from "../models/usersTypes";
import {CommentsDbType} from "../models/commentsTypes";
import {AuthSessionsType, PasswordRecoveryType, RateLimitIpType} from "../models/authTypes";

export const PostSchema = new mongoose.Schema<WithId<PostsDbType>>({
    title: {type: String, require: true},
    shortDescription: {type: String, require: true},
    content: {type: String, require: true},
    blogId: {type: String, require: true},
    blogName: {type: String, require: true},
    createdAt: {type: String, require: true}
})

export const BlogSchema = new mongoose.Schema<WithId<BlogsDbType>>({
    name: {type: String, require: true},
    description: {type: String, require: true},
    websiteUrl: {type: String, require: true},
    createdAt: {type: String, require: true},
    isMembership: {type: Boolean, require: true}
})

export const UserSchema = new mongoose.Schema<WithId<UsersDbType>>({
    login: {type: String, require: true},
    email: {type: String, require: true},
    passwordHash: {type: String, require: true},
    passwordSalt: {type: String, require: true},
    isConfirmed: {type: Boolean, require: true},
    createdAt: {type: String, require: true}
})

export const CommentSchema = new mongoose.Schema<WithId<CommentsDbType>>({
    content: {type: String, require: true},
    commentatorInfo: {
        userId: {type: String, require: true},
        userLogin: {type: String, require: true}
    },
    createdAt: {type: String, require: true},
    postId: {type: String, require: true}
})

export const EmailConfirmationSchema = new mongoose.Schema<WithId<EmailConfirmationType>>({
    userId: {type: String, require: true},
    confirmationCode: {type: String, require: true},
    expirationDate: {type: Date, require: true}
})

export const DeviceAuthSessionSchema = new mongoose.Schema<WithId<AuthSessionsType>>({
    userId: {type: String, require: true},
    ip: {type: String, require: true},
    deviceId: {type: String, require: true},
    title: {type: String, require: true},
    lastActiveDate: {type: Date, require: true},
    expiresAt: {type: Date, require: true}
})

export const RateLimitIpSchema = new mongoose.Schema<WithId<RateLimitIpType>>({
    ip: {type: String, require: true},
    url: {type: String, require: true},
    date: {type: Date, require: true}
})

export const PasswordRecoverySchema = new mongoose.Schema<WithId<PasswordRecoveryType>>({
    email: {type: String, require: true},
    code: {type: String, require: true},
    expirationDate: {type: Date, require: true}
})