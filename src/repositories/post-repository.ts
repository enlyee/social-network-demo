
import {postInputType, postsDbType, postsOutputType} from "../models/postsType";
import {blogsCollection, postsCollection} from "../db/runDb";
import {postMapper} from "../models/mappers/postsMapper";
import {ObjectId} from "mongodb";

export const postRepository = {
    async getPosts(): Promise<postsOutputType[]> {
        const posts = await postsCollection.find({}).toArray()
        return posts.map(postMapper)
    },
    async getPostById(id: string): Promise<postsOutputType | false> {
        let post = await postsCollection.findOne({_id: new ObjectId(id)})
        if (post) {
            return postMapper(post)
        }
        else {
            return false
        }
    },
    async createPost(post: postInputType) {
        let blog = await blogsCollection.findOne({_id: new ObjectId(post.blogId)})
        if (!blog) {
            return
        }
        const inputPost: postsDbType = {
            ...post,
            blogName: blog.name,
            createdAt: (new Date()).toISOString()
        }
        let newPost = await postsCollection.insertOne(inputPost)
        return postMapper({
            _id: newPost.insertedId,
            ...inputPost
        })
    },
    async deletePost(id: string){
        let ind = await postsCollection.deleteOne({_id: new ObjectId(id)})
        return !!ind
    },
    async updatePost(id: string, post: postInputType){
        let ind = await postsCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {title: post.title, shortDescription: post.shortDescription, content: post.content, blogId: post.blogId}
        })
        return !!ind;

    }
}