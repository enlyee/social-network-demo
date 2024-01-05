import {BlogsOutputType} from "./blogsType";

export type PostsOutputType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
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