import {PostInputType, PostsDbType, PostsOutputType} from "../models/postsType";
import {ObjectId} from "mongodb";
import {LikeStatusType} from "../models/commonType";
import {PostRepository} from "../repositories/postRepository";
import {injectable} from "inversify";
import {BlogsQueryRepository} from "../queryRepositories/blogsQuery";
import {PostsQueryRepository} from "../queryRepositories/postsQuery";

@injectable()
export class PostService {
    constructor(protected postRepository: PostRepository,
                protected postQueryRepository: PostsQueryRepository,
                protected blogsQueryRepository: BlogsQueryRepository) {}
    async createPost(post: PostInputType): Promise<PostsOutputType | false> {
        const blog = await this.blogsQueryRepository.getBlogById(post.blogId)
        if (!blog) {
            return false
        }
        const inputPost: PostsDbType = {
            ...post,
            blogName: blog.name,
            createdAt: (new Date()).toISOString()
        }
        return await this.postRepository.createPost(inputPost)
    }
    async deletePost(id: string): Promise<boolean>{
        if (!ObjectId.isValid(id)) return false
        return await this.postRepository.deletePost(id)
    }
    async updatePost(id: string, post: PostInputType): Promise<boolean>{
        return await this.postRepository.updatePost(id, post)
    }
    async likeDislikePost(postId: string, userId: string, status: LikeStatusType){
        const post = await this.postQueryRepository.getPostById(postId)
        if (!post) return null
        await this.postRepository.likeDislikePost(postId, userId, status)
        return true
    }
}
