import {blogInputType, blogsDbType, blogsOutputType} from "../models/blogsType";
import {blogsCollection} from "../db/runDb";
import {blogMapper} from "../models/mappers/blogsMapper";
import {ObjectId} from "mongodb";

export const blogRepository = {
    async getBlogs(): Promise<blogsOutputType[]> {
        const blogs = await blogsCollection.find({}).toArray()
        return blogs.map(blogMapper)
    },
    async getBlogById(id: string): Promise<blogsOutputType | false> {
        let blog = await blogsCollection.findOne({_id: new ObjectId(id)})
        if (blog) {
            return blogMapper(blog)
        }
        else {
            return false
        }
    },
    async createBlog(blog: blogInputType): Promise<blogsOutputType> {
        const inputBlog: blogsDbType = {
            ...blog,
            createdAt: (new Date()).toISOString(),
            isMembership: false
        }
        const newBlog = await blogsCollection.insertOne(inputBlog)
        return blogMapper({
            _id: newBlog.insertedId,
            ...inputBlog
        })

    },
    async deleteBlog(id: string): Promise<boolean>{
        let blogIndex = await blogsCollection.deleteOne({_id: (new ObjectId (id))})
        return !!blogIndex;
    },
    async updateBlog(id: string, blog: blogInputType): Promise<boolean>{
        let ind = await blogsCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {name: blog.name, description: blog.description, websiteUrl: blog.websiteUrl}
        })
        return !!ind;
    }
}