import {PostInputType, PostsDbType, PostsOutputType, QueryPostsOutputType} from "../models/postsType";
import {blogsCollection, postsCollection} from "../db/runDb";
import {PostMapper} from "../models/mappers/postsMapper";
import {ObjectId} from "mongodb";
import {QueryGetPostsType} from "../models/commonType";
import {BlogMapper} from "../models/mappers/blogsMapper";
const sortingPostsName = ['id', 'title', 'shortDescription', 'content', 'blogName', 'createdAt', 'blogId']
export const postRepository = {
    async getPosts(query: QueryGetPostsType): Promise<QueryPostsOutputType> {
        let sortBy = (query.sortBy) ? (sortingPostsName.includes(query.sortBy)) ? (query.sortBy) : 'createdAt' : 'createdAt'
        let sortDirection = query.sortDirection || 'desc'
        let pageNumber = query.pageNumber || 1
        let pageSize = query.pageSize || 10

        const collectionSize = (await postsCollection.find({}).toArray()).length

        const posts = await postsCollection
            .find({})
            .sort(sortBy, sortDirection).skip((pageNumber-1)*pageSize).limit(+pageSize)
            .toArray()
        return {
            pagesCount: Math.ceil(collectionSize/pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: collectionSize,
            items: posts.map(PostMapper)
        }
    },
    async getPostById(id: string): Promise<PostsOutputType | false> {
        const post = await postsCollection.findOne({_id: new ObjectId(id)})
        if (!post) {
            return false
        }
        return PostMapper(post)
    },
    async createPost(inputPost: PostsDbType): Promise<PostsOutputType | false> {
        const newPost = await postsCollection.insertOne(inputPost)
        return PostMapper({
            _id: newPost.insertedId,
            ...inputPost
        })
    },
    async deletePost(id: string): Promise<boolean>{
        const ind = await postsCollection.deleteOne({_id: new ObjectId(id)})
        return !!ind.deletedCount
    },
    async updatePost(id: string, post: PostInputType){
         return await postsCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {title: post.title, shortDescription: post.shortDescription, content: post.content, blogId: post.blogId}
        })


    }
}