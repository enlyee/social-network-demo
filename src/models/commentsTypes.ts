export type CommentsDbType = {
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
},
    createdAt: string,
    postId: string
}

export type FindParamsCommentsType = {
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageNumber: number,
    pageSize: number,
    postId: string
}

export type CommentsOutputType = {
    id: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string
}

export type CommentsDtoType = {
    id: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string,
    postId: string
}