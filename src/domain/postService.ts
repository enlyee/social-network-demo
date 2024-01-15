import {PostInputType, PostsDbType, PostsOutputType, QueryPostsOutputType} from "../models/postsType";
import {blogsCollection, postsCollection} from "../db/runDb";
import {PostMapper} from "../models/mappers/postsMapper";
import {ObjectId} from "mongodb";
import {postRepository} from "../repositories/postRepository";
import {blogRepository} from "../repositories/blogRepository";
import {QueryGetPostsType} from "../models/commonType";

export const postService = {
    async getPosts(query: QueryGetPostsType): Promise<QueryPostsOutputType> {
        return await postRepository.getPosts(query)
    },
    async getPostById(id: string): Promise<PostsOutputType | false> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        return await postRepository.getPostById(id)
    },
    async createPost(post: PostInputType): Promise<PostsOutputType | false> {
        const blog = await blogRepository.getBlogById(post.blogId)
        if (!blog) {
            return false
        }
        const inputPost: PostsDbType = {
            ...post,
            blogName: blog.name,
            createdAt: (new Date()).toISOString()
        }
        return await postRepository.createPost(inputPost)
    },
    async deletePost(id: string): Promise<boolean>{
        return await postRepository.deletePost(id)
    },
    async updatePost(id: string, post: PostInputType): Promise<boolean>{
        const ind = await postRepository.updatePost(id, post)
        return !!ind.matchedCount;
    }
}