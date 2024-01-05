import {BlogInputType, BlogsDbType, BlogsOutputType, QueryBlogsOutputType} from "../models/blogsType";
import {blogsCollection, postsCollection} from "../db/runDb";
import {BlogMapper} from "../models/mappers/blogsMapper";
import {ObjectId} from "mongodb";
import {QueryGetBlogsType, QueryGetPostsType} from "../models/commonType";
import {QueryPostsOutputType} from "../models/postsType";
import {PostMapper} from "../models/mappers/postsMapper";
const sortingBlogsName = ['id', 'name', 'description', 'createdAt']
const sortingPostsName = ['id', 'title', 'shortDescription', 'content', 'blogName', 'createdAt', 'blogId']


export const blogRepository = {
    async findBlogs(query: QueryGetBlogsType): Promise<QueryBlogsOutputType> {

        let searchNameTerm = query.searchNameTerm || ''
        let sortBy = (query.sortBy) ? (sortingBlogsName.includes(query.sortBy)) ? (query.sortBy) : 'createdAt' : 'createdAt'
        let sortDirection = query.sortDirection || 'desc'
        let pageNumber = query.pageNumber || 1
        let pageSize = query.pageSize || 10

        const collectionSize = (await blogsCollection.find({name: new RegExp(searchNameTerm, 'i')}).toArray()).length

        const blogs = await blogsCollection
            .find({name: new RegExp(searchNameTerm, 'i')})
            .sort(sortBy, sortDirection).skip((pageNumber-1)*pageSize).limit(+pageSize)
            .toArray()
        return {
            pagesCount: Math.ceil(collectionSize/pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: collectionSize,
            items: blogs.map(BlogMapper)
        }

    },
    async getBlogById(id: string): Promise<BlogsOutputType | false> {
        if (!ObjectId.isValid(id)) {
            return false
        }
        const blog = await blogsCollection.findOne({_id: new ObjectId(id)})
        if (blog) {
            return BlogMapper(blog)
        }
        else {
            return false
        }
    },
    async createBlog(blog: BlogsDbType): Promise<BlogsOutputType> {
        const newBlog = await blogsCollection.insertOne(blog)
        return BlogMapper({
            _id: newBlog.insertedId,
            ...blog
        })

    },
    async deleteBlog(id: string): Promise<boolean>{
        if (!ObjectId.isValid(id)) {
            return false
        }
        const blogIndex = await blogsCollection.deleteOne({_id: (new ObjectId (id))})
        return !!blogIndex.deletedCount
    },
    async updateBlog(id: string, blog: BlogInputType) {
        return await blogsCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {name: blog.name, description: blog.description, websiteUrl: blog.websiteUrl}
        })

    },
    async findPostsByBlogId(id: string, query: QueryGetPostsType): Promise<QueryPostsOutputType>{
        let sortBy = (query.sortBy) ? (sortingPostsName.includes(query.sortBy)) ? (query.sortBy) : 'createdAt' : 'createdAt'
        let sortDirection = query.sortDirection || 'desc'
        let pageNumber = query.pageNumber || 1
        let pageSize = query.pageSize || 10

        const collectionSize = (await postsCollection.find({blogId: id}).toArray()).length

        const posts = await postsCollection
            .find({blogId: id})
            .sort(sortBy, sortDirection).skip((pageNumber-1)*pageSize).limit(+pageSize)
            .toArray()
        return {
            pagesCount: Math.ceil(collectionSize/pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: collectionSize,
            items: posts.map(PostMapper)
        }
    }
}