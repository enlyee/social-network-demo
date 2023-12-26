import {MongoClient} from "mongodb";
import {postsDbType, postsOutputType} from "../models/postsType";
import {blogsDbType, blogsOutputType} from "../models/blogsType";
import dotenv from 'dotenv'
dotenv.config()


const url = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
console.log('url: ', url)
const client = new MongoClient(url)

export const postsCollection = client.db().collection<postsDbType>('posts');
export const blogsCollection = client.db().collection<blogsDbType>('blogs');

export async function runDb() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch {
        // Ensures that the client will close when you finish/error
        await client.close();
}}