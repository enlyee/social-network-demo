import {BlogsDbType, BlogsOutputType} from "../blogsType";
import {WithId} from "mongodb";

export const BlogMapper = (blogDb: WithId<BlogsDbType>): BlogsOutputType => {
    return {
        id: blogDb._id.toString(),
        name: blogDb.name,
        description: blogDb.description,
        websiteUrl: blogDb.websiteUrl,
        createdAt: blogDb.createdAt,
        isMembership: blogDb.isMembership
    }
}