import {BlogInputType, BlogsDbType, BlogsOutputType, QueryBlogsOutputType} from "../models/blogsType";
import {BlogModel, PostModel} from "../db/db";
import {BlogMapper} from "../models/mappers/blogsMapper";
import {ObjectId} from "mongodb";
import {QueryGetBlogsType, QueryGetPostsType} from "../models/commonType";
import {QueryPostsOutputType} from "../models/postsType";
import {PostMapper} from "../models/mappers/postsMapper";
const sortingBlogsName = ['id', 'name', 'description', 'createdAt']
const sortingPostsName = ['id', 'title', 'shortDescription', 'content', 'blogName', 'createdAt', 'blogId']


export const blogRepository = {
    async findBlogs(query: QueryGetBlogsType): Promise<QueryBlogsOutputType> {
        //todo .............
        let searchNameTerm = query.searchNameTerm || ''
        let sortBy = (query.sortBy) ? (sortingBlogsName.includes(query.sortBy)) ? (query.sortBy) : 'createdAt' : 'createdAt'
        let sortDirection = query.sortDirection || 'desc'
        let pageNumber = query.pageNumber || 1
        let pageSize = query.pageSize || 10

        const collectionSize = (await BlogModel.find({name: new RegExp(searchNameTerm, 'i')}).lean()).length

        const blogs = await BlogModel
            .find({name: new RegExp(searchNameTerm, 'i')})
            .sort({[sortBy]: sortDirection}).skip((pageNumber-1)*pageSize).limit(+pageSize)
            .lean()
        return {
            pagesCount: Math.ceil(collectionSize/pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: collectionSize,
            items: blogs.map(BlogMapper)
        }

    },
    async getBlogById(id: string): Promise<BlogsOutputType | false> {
        const blog = await BlogModel.findOne({_id: new ObjectId(id)})
        if (blog) {
            return BlogMapper(blog)
        }
        else {
            return false
        }
    },
    async createBlog(blog: BlogsDbType): Promise<BlogsOutputType> {
        const newBlog = await BlogModel.create(blog)
        return BlogMapper({
            _id: newBlog._id,
            ...blog
        })

    },
    async deleteBlog(id: string): Promise<boolean>{

        const blogIndex = await BlogModel.deleteOne({_id: (new ObjectId (id))})
        return !!blogIndex.deletedCount
    },
    async updateBlog(id: string, blog: BlogInputType) {
        return BlogModel.updateOne({_id: new ObjectId(id)}, {
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl
        })

    },
    async findPostsByBlogId(id: string, query: QueryGetPostsType): Promise<QueryPostsOutputType>{
        let sortBy = (query.sortBy) ? (sortingPostsName.includes(query.sortBy)) ? (query.sortBy) : 'createdAt' : 'createdAt'
        let sortDirection = query.sortDirection || 'desc'
        let pageNumber = query.pageNumber || 1
        let pageSize = query.pageSize || 10


        //todo: const totalCount: number = await UserModel.countDocuments(findFilter);
        const collectionSize = (await PostModel.find({blogId: id}).lean()).length

        const posts = await PostModel
            .find({blogId: id})
            .sort({[sortBy]: sortDirection}).skip((pageNumber-1)*pageSize).limit(+pageSize)
            .lean()
        return {
            pagesCount: Math.ceil(collectionSize/pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: collectionSize,
            items: posts.map(PostMapper)
        }
    }
}