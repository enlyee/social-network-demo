import {BlogInputType, BlogsDbType, BlogsOutputType, QueryBlogsOutputType} from "../models/blogsType";
import {blogsCollection} from "../db/runDb";
import {ObjectId} from "mongodb";
import {blogRepository} from "../repositories/blogRepository";
import {QueryGetBlogsType, QueryGetPostsType} from "../models/commonType";
import {PostInputType, PostInputTypeWithoutId, PostsOutputType, QueryPostsOutputType} from "../models/postsType";
import {postService} from "./postService";

export const blogService = {
    async getBlogs(query: QueryGetBlogsType): Promise<QueryBlogsOutputType> {
        return await blogRepository.findBlogs(query)
    },
    async getBlogById(id: string): Promise<BlogsOutputType | false> {
        return await blogRepository.getBlogById(id)
    },
    async createBlog(blog: BlogInputType): Promise<BlogsOutputType> {
        const inputBlog: BlogsDbType = {
            ...blog,
            createdAt: (new Date()).toISOString(),
            isMembership: false
        }
        return await blogRepository.createBlog(inputBlog)

    },
    async deleteBlog(id: string): Promise<boolean>{
        return await blogRepository.deleteBlog(id)
    },
    async updateBlog(id: string, blog: BlogInputType): Promise<boolean>{
        const ind = await blogRepository.updateBlog(id, blog)
        return !!ind.matchedCount;
    },
    async findPostsByBlogId(id: string, query: QueryGetPostsType): Promise<QueryPostsOutputType>{
        return await blogRepository.findPostsByBlogId(id, query)
    },
    async createPostByBlogId(id: string, post: PostInputTypeWithoutId): Promise<PostsOutputType | false>{
        if (!(await this.getBlogById(id))) {
            return false
        }
        const body: PostInputType = {
            ...post,
            blogId: id
        }
        return postService.createPost(body)
    }
}

//await ???????