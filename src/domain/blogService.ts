import {BlogInputType, BlogsDbType, BlogsOutputType} from "../models/blogsType";
import {PostInputType, PostInputTypeWithoutId, PostsOutputType} from "../models/postsType";
import {PostService} from "./postService";
import {BlogRepository} from "../repositories/blogRepository";
import {injectable} from "inversify";
import {ObjectId} from "mongodb";
@injectable()
export class BlogService {

    constructor(protected postService: PostService,
                protected blogRepository: BlogRepository) {}

    async createBlog(blog: BlogInputType): Promise<BlogsOutputType> {
        const inputBlog: BlogsDbType = {
            ...blog,
            createdAt: (new Date()).toISOString(),
            isMembership: false
        }
        console.log(inputBlog)
        return await this.blogRepository.createBlog(inputBlog)

    }
    async deleteBlog(id: string): Promise<boolean>{
        if (!ObjectId.isValid(id)) return false
        return await this.blogRepository.deleteBlog(id)
    }
    async updateBlog(id: string, blog: BlogInputType): Promise<boolean>{
        if (!ObjectId.isValid(id)) return false
        const ind = await this.blogRepository.updateBlog(id, blog)
        return !!ind.matchedCount;
    }
    async createPostByBlogId(id: string, post: PostInputTypeWithoutId): Promise<PostsOutputType | false>{
        if (!ObjectId.isValid(id)) return false
        const body: PostInputType = {
            ...post,
            blogId: id
        }
        return await this.postService.createPost(body)
    }
}