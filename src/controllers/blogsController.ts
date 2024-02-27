import {BlogService} from "../domain/blogService";
import {
    QueryGetBlogsType,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../models/commonType";
import {Response} from "express";
import {PostInputTypeWithoutId} from "../models/postsType";
import {BlogInputType, BlogsOutputType} from "../models/blogsType";
import {injectable} from "inversify";
import {BlogsQueryRepository} from "../queryRepositories/blogsQuery";
import {PostsQueryRepository} from "../queryRepositories/postsQuery";
@injectable()
export class BlogsController {
    constructor(protected blogService: BlogService,
                protected blogsQueryRepository: BlogsQueryRepository,
                protected postsQueryRepository: PostsQueryRepository) {
    }

    async getAllBlogs(req: RequestWithQuery<QueryGetBlogsType>, res: Response) {
        const blogs = await this.blogsQueryRepository.getBlogs(req.query)
        res.send(blogs)
    }

    async getBlogsPosts(req: RequestWithParamsAndQuery<{ id: string }, QueryGetBlogsType>, res: Response) {
        const posts = await this.postsQueryRepository.getPosts(req.query, req.userId, req.params.id)
        if (!posts){
            res.sendStatus(404)
            return
        }
        res.status(200).send(posts)
    }

    async createPostToBlog(req: RequestWithParamsAndBody<{ id: string }, PostInputTypeWithoutId>, res: Response) {
        const newPost = await this.blogService.createPostByBlogId(req.params.id, req.body)
        if (!newPost) {
            res.sendStatus(404)
            return
        }
        res.status(201).send(newPost)
    }

    async getBlogById(req: RequestWithParams<{ id: string }>, res: Response) {
        const blog = await this.blogsQueryRepository.getBlogById(req.params.id)
        if (!blog) {
            res.sendStatus(404)
            return
        }
        res.send(blog)
    }

    async createBlog(req: RequestWithBody<BlogInputType>, res: Response) {
        const newBlog: BlogsOutputType = await this.blogService.createBlog(req.body)
        res.status(201).send(newBlog)
    }

    async deleteBlogById(req: RequestWithParams<{ id: string }>, res: Response) {
        const delStatus = await this.blogService.deleteBlog(req.params.id)
        if (!delStatus) {
            res.sendStatus(404)
            return
        }
        res.sendStatus(204)
    }

    async editBlog(req: RequestWithParamsAndBody<{ id: string }, BlogInputType>, res: Response) {
        const putStatus = await this.blogService.updateBlog(req.params.id, req.body);
        if (!putStatus) {
            res.sendStatus(404)
            return
        }
        res.sendStatus(204)
    }
}