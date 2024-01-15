import {WithId} from "mongodb";
import {CommentsDbType, CommentsOutputType} from "../commentsTypes";

export const CommentsMapper = (commentsDb: WithId<CommentsDbType>): CommentsOutputType => {
    return {
        id: commentsDb._id.toString(),
        content: commentsDb.content,
        commentatorInfo: {
            userId: commentsDb.commentatorInfo.userId,
            userLogin: commentsDb.commentatorInfo.userLogin
        },
        createdAt: commentsDb.createdAt
    }
}