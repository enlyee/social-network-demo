import {PostRepository} from "../repositories/postRepository";
import {QueryGetPostsType} from "../models/commonType";
import {
    PostsOutputType,
    QueryPostsOutputType
} from "../models/postsType";
import {ObjectId} from "mongodb";
import {BlogModel, PostModel} from "../db/db";
import {QueryFormat} from "../application/queryAdaptive";
import {injectable} from "inversify";
import {Mappers} from "../models/mappers/mappers";

@injectable()
export class PostsQueryRepository {
    constructor(protected postRepository: PostRepository,
                protected queryFormat: QueryFormat,
                protected mappers: Mappers) {}
    async getPosts(query: QueryGetPostsType, userId: string | undefined, blogId: string | null = null): Promise<QueryPostsOutputType | false> {
        if (blogId) {
            if (!ObjectId.isValid(blogId)) return false
            const blog = await BlogModel.findOne({_id: new ObjectId(blogId)})
            if (!blog) return false
        }
        const newQuery = await this.queryFormat.postsQueryFormat(query)
        const collectionSize = await PostModel.countDocuments({})
        const findFilter = blogId ? {blogId: blogId} : {}
        const posts = await PostModel
            .find(findFilter)
            .sort({[newQuery.sortBy]: newQuery.sortDirection})
            .skip((newQuery.pageNumber-1)*newQuery.pageSize)
            .limit(+newQuery.pageSize).lean()
        return {
            pagesCount: Math.ceil(collectionSize/newQuery.pageSize),
            page: +newQuery.pageNumber,
            pageSize: +newQuery.pageSize,
            totalCount: collectionSize,
            items: await Promise.all(posts.map(posts => this.mappers.postMapper(posts, userId)))
        }
    }
    async getPostById(id: string, userId?: string): Promise<PostsOutputType | false> {
        if (!ObjectId.isValid(id)) return false
        const post = await PostModel.findOne({_id: new ObjectId(id)}).lean()
        if (!post) return false
        return this.mappers.postMapper(post, userId)
    }
}
