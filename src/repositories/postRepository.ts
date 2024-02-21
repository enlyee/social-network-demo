import {PostInputType, PostsDbType, PostsOutputType, QueryPostsOutputType} from "../models/postsType";
import {PostMapper} from "../models/mappers/postsMapper";
import {ObjectId} from "mongodb";
import {QueryGetPostsType} from "../models/commonType";
import {PostModel} from "../db/db";
const sortingPostsName = ['id', 'title', 'shortDescription', 'content', 'blogName', 'createdAt', 'blogId']

class PostRepository {
    async getPosts(query: QueryGetPostsType): Promise<QueryPostsOutputType> {
        //todo ...............
        let sortBy = (query.sortBy) ? (sortingPostsName.includes(query.sortBy)) ? (query.sortBy) : 'createdAt' : 'createdAt'
        let sortDirection = query.sortDirection || 'desc'
        let pageNumber = query.pageNumber || 1
        let pageSize = query.pageSize || 10

        const collectionSize = (await PostModel.find({}).lean()).length

        const posts = await PostModel
            .find({})
            .sort({[sortBy]: sortDirection}).skip((pageNumber-1)*pageSize).limit(+pageSize).lean()
        return {
            pagesCount: Math.ceil(collectionSize/pageSize),
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount: collectionSize,
            items: posts.map(PostMapper)
        }
    }
    async getPostById(id: string): Promise<PostsOutputType | false> {
        const post = await PostModel.findOne({_id: new ObjectId(id)}).lean()
        if (!post) {
            return false
        }
        return PostMapper(post)
    }
    async createPost(inputPost: PostsDbType): Promise<PostsOutputType | false> {
        const newPost = await PostModel.create(inputPost)
        return PostMapper({
            _id: newPost._id,
            ...inputPost
        })
    }
    async deletePost(id: string): Promise<boolean>{
        const ind = await PostModel.deleteOne({_id: new ObjectId(id)})
        return !!ind.deletedCount
    }
    async updatePost(id: string, post: PostInputType){
        return !!(await PostModel.updateOne({id}, {
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId
        })).matchedCount
    }
}

export const postRepository = new PostRepository()