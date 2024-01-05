import {WithId} from "mongodb";
import {PostsDbType, PostsOutputType} from "../postsType";

export const PostMapper = (postDb: WithId<PostsDbType>): PostsOutputType => {
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