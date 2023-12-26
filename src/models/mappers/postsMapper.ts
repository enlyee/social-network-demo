import {WithId} from "mongodb";
import {postsDbType, postsOutputType} from "../postsType";

export const postMapper = (postDb: WithId<postsDbType>): postsOutputType => {
    return {
        id: postDb._id.toString(),
        title: postDb.title,
        shortDescription: postDb.shortDescription,
        content: postDb.content,
        blogId: postDb.blogId,
        blogName: postDb.blogName,
        createdAt: postDb.createdAt
    }
}