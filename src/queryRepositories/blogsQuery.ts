import {QueryGetBlogsType} from "../models/commonType";
import {BlogsOutputType, QueryBlogsOutputType} from "../models/blogsType";
import {BlogModel} from "../db/db";
import {QueryFormat} from "../application/queryAdaptive";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";
import {Mappers} from "../models/mappers/mappers";

@injectable()
export class BlogsQueryRepository {
    constructor(protected queryFormat: QueryFormat,
                protected mappers: Mappers) {}
    async getBlogs(query: QueryGetBlogsType): Promise<QueryBlogsOutputType> {
        const newQuery = await this.queryFormat.blogsQueryFormat(query)

        const collectionSize = await BlogModel.countDocuments({name: new RegExp(newQuery.searchNameTerm, 'i')})

        const blogs = await BlogModel
            .find({name: new RegExp(newQuery.searchNameTerm, 'i')})
            .sort({[newQuery.sortBy]: newQuery.sortDirection}).skip((newQuery.pageNumber-1)*newQuery.pageSize).limit(+newQuery.pageSize)
            .lean()
        return {
            pagesCount: Math.ceil(collectionSize/newQuery.pageSize),
            page: +newQuery.pageNumber,
            pageSize: +newQuery.pageSize,
            totalCount: collectionSize,
            items: blogs.map(this.mappers.blogMapper)
        }
    }
    async getBlogById(id: string): Promise<BlogsOutputType | false> {
        if (!ObjectId.isValid(id)) return false
        const blog = await BlogModel.findOne({_id: new ObjectId(id)})
        if (!blog) return false
        return this.mappers.blogMapper(blog)
    }
}