import {LikeStatusType} from "./commonType";

export type PostsOutputType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: LikeStatusType,
        newestLikes: NewestLikesType[]
    }
}

export type NewestLikesType = {
    addedAt: string,
    userId: string,
    login: string
}

export type PostInputType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}
export type PostInputTypeWithoutId = {
    title: string,
    shortDescription: string,
    content: string,
}
export type PostsDbType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}

export type QueryPostsOutputType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: PostsOutputType[]
}

export type PostsLikesDislikesDbType = {
    postId: string,
    userId: string,
    status: LikeStatusType,
    addedAt: Date
}