import {PostInputType, PostsDbType, PostsOutputType, QueryPostsOutputType} from "../models/postsType";
import {ObjectId} from "mongodb";
import {postRepository} from "../repositories/postRepository";
import {blogRepository} from "../repositories/blogRepository";
import {QueryGetPostsType} from "../models/commonType";


class PostService {
    async getPosts(query: QueryGetPostsType): Promise<QueryPostsOutputType> {
        return await postRepository.getPosts(query)
    }
    async getPostById(id: string): Promise<PostsOutputType | false> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        return await postRepository.getPostById(id)
    }
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
    }
    async deletePost(id: string): Promise<boolean>{
        return await postRepository.deletePost(id)
    }
    async updatePost(id: string, post: PostInputType): Promise<boolean>{
        return await postRepository.updatePost(id, post)
    }
}
export const postService = new PostService()