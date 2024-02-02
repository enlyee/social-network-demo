import {MongoClient} from "mongodb";
import {PostsDbType} from "../models/postsType";
import {BlogsDbType} from "../models/blogsType";
import dotenv from 'dotenv'
import {EmailConfirmationType, UsersDbType} from "../models/usersTypes";
import {CommentsDbType} from "../models/commentsTypes";
import {AuthSessionsType, RateLimitIpType} from "../models/authTypes";
dotenv.config()


const url = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
console.log('url: ', url)
const client = new MongoClient(url)

export const postsCollection = client.db().collection<PostsDbType>('posts')
export const blogsCollection = client.db().collection<BlogsDbType>('blogs')
export const usersCollection = client.db().collection<UsersDbType>('users')

export const commentsCollection = client.db().collection<CommentsDbType>('comments')

export const emailConfirmationCollection = client.db().collection<EmailConfirmationType>('emailconfirmations')
//export const tokensBlackListCollection = client.db().collection<{token: string}>('tokensBlackList')
export const rateLimitIpCollection = client.db().collection<RateLimitIpType>('rateLimitIp')
export const deviceAuthSessions = client.db().collection<AuthSessionsType>('deviceAuthSessions')

export async function runDb() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        console.log("successfully connected to MongoDB!");
    } catch {
        // Ensures that the client will close when you finish/error
        await client.close();
}}