import {QueryGetBlogsType, QueryGetCommentsType} from "../models/commonType";
import {injectable} from "inversify";

const sortingBlogsName = ['id', 'name', 'description', 'createdAt']
const sortingPostsName = ['id', 'title', 'shortDescription', 'content', 'blogName', 'createdAt', 'blogId']
const sortingCommentsName = ['createdAt', 'id']

@injectable()
export class QueryFormat {
    async blogsQueryFormat(query: QueryGetBlogsType) {
        const newQuery: FormatQueryGetBlogsType = {
            searchNameTerm: query.searchNameTerm || '',
            sortBy: (query.sortBy) ? (sortingBlogsName.includes(query.sortBy)) ? (query.sortBy) : 'createdAt' : 'createdAt',
            sortDirection: query.sortDirection === "asc" ? "asc" : 'desc',
            pageNumber: query.pageNumber || 1,
            pageSize: query.pageSize || 10
        }
        return newQuery
    }
    async postsQueryFormat(query: QueryGetBlogsType) {
        const newQuery: FormatQueryGetPostsType = {
            sortBy: (query.sortBy) ? (sortingPostsName.includes(query.sortBy)) ? (query.sortBy) : 'createdAt' : 'createdAt',
            sortDirection: query.sortDirection || 'desc',
            pageNumber: query.pageNumber || 1,
            pageSize: query.pageSize || 10
        }
        return newQuery
    }
    async commentsQueryFormat(query: QueryGetCommentsType){
        const newQuery: FormatQueryGetCommentsType = {
            sortBy: (query.sortBy) ? (sortingCommentsName.includes(query.sortBy)) ? (query.sortBy) : 'createdAt' : 'createdAt',
            sortDirection: query.sortDirection || 'desc',
            pageNumber: query.pageNumber || 1,
            pageSize: query.pageSize || 10,
        }
        return newQuery
    }
}


export type FormatQueryGetBlogsType = {
    searchNameTerm: string,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageNumber: number,
    pageSize: number
}


export type FormatQueryGetPostsType = {
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageNumber: number,
    pageSize: number
}

export type FormatQueryGetCommentsType = {
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageNumber: number,
    pageSize: number
}
/*
export type QueryGetUsersType = {
    searchLoginTerm?: string,
    searchEmailTerm?: string,
    sortBy?: string,
    sortDirection?: 'asc' | 'desc',
    pageNumber?: number,
    pageSize?: number
}


}*/
