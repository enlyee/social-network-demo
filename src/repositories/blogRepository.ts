import {BlogInputType, BlogsDbType, BlogsOutputType} from "../models/blogsType";
import {BlogModel} from "../db/db";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";
import {Mappers} from "../models/mappers/mappers";


@injectable()
export class BlogRepository {
    constructor(protected mappers: Mappers) {
    }
    async createBlog(blog: BlogsDbType): Promise<BlogsOutputType> {
        const newBlog = await BlogModel.create(blog)
        return this.mappers.blogMapper({
            _id: newBlog._id,
            ...blog
        })
    }
    async deleteBlog(id: string): Promise<boolean>{

        const blogIndex = await BlogModel.deleteOne({_id: (new ObjectId (id))})
        return !!blogIndex.deletedCount
    }
    async updateBlog(id: string, blog: BlogInputType) {
        return BlogModel.updateOne({_id: new ObjectId(id)}, {
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl
        })

    }
}