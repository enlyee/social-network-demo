import {blogsDbType, blogsOutputType} from "../blogsType";
import {WithId} from "mongodb";

export const blogMapper = (blogDb: WithId<blogsDbType>): blogsOutputType => {
    return {
        id: blogDb._id.toString(),
        name: blogDb.name,
        description: blogDb.description,
        websiteUrl: blogDb.websiteUrl,
        createdAt: blogDb.createdAt,
        isMembership: blogDb.isMembership
    }
}