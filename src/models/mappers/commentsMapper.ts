import {WithId} from "mongodb";
import {CommentsDbType, CommentsViewType} from "../commentsTypes";
import {commentsRepository} from "../../repositories/commentsRepository";

export const CommentsMapper = async (commentsDb: WithId<CommentsDbType>, userId?: string): Promise<CommentsViewType> => {

    let status: 'None' | 'Like' | 'Dislike'
    if (!userId) status = 'None'
    else status = await commentsRepository.getCommentMyStatus(userId, commentsDb._id.toString())
    const {likes, dislikes} = await commentsRepository.getCommentLikesDislikes(commentsDb._id.toString())

    return {
        id: commentsDb._id.toString(),
        content: commentsDb.content,
        commentatorInfo: {
            userId: commentsDb.commentatorInfo.userId,
            userLogin: commentsDb.commentatorInfo.userLogin
        },
        createdAt: commentsDb.createdAt,
        likesInfo: {
            likesCount: likes,
            dislikesCount: dislikes,
            myStatus: status
        }
    }
}