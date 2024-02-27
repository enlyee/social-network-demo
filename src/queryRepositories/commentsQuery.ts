import {CommentModel} from "../db/db";
import {ObjectId} from "mongodb";
import {PostsQueryRepository} from "./postsQuery";
import {QueryGetCommentsType} from "../models/commonType";
import {Mappers} from "../models/mappers/mappers";
import {QueryFormat} from "../application/queryAdaptive";
import {injectable} from "inversify";

@injectable()
export class CommentsQueryRepository {
    constructor(protected postsQueryRepository: PostsQueryRepository,
                protected mappers: Mappers,
                protected queryFormat: QueryFormat) {
    }
    async getCommentById(commentId: string, userId?: string) {
        if (!ObjectId.isValid(commentId)) return false
        const comment = await CommentModel.findOne({_id: new ObjectId(commentId)})
        if (!comment) return false
        if (!userId) return this.mappers.commentMapper(comment)
        return this.mappers.commentMapper(comment, userId)
    }
    async getComments(postId: string, query: QueryGetCommentsType, userId: string = 'None') {
        const isExist = await this.postsQueryRepository.getPostById(postId)
        if (!isExist) return 404
        const findParams = await this.queryFormat.commentsQueryFormat(query)
        const collectionSize = await CommentModel
            .countDocuments({postId: postId})
        const comments = await CommentModel
            .find({postId: postId})
            .sort({[findParams.sortBy]: findParams.sortDirection})
            .skip((findParams.pageNumber-1)*findParams.pageSize)
            .limit(+findParams.pageSize)
            .lean()

        return {
            pagesCount: Math.ceil(collectionSize/findParams.pageSize),
            page: +findParams.pageNumber,
            pageSize: +findParams.pageSize,
            totalCount: collectionSize,
            items: await Promise.all(comments.map(comments => this.mappers.commentMapper(comments, userId)))
        }
    }
}
