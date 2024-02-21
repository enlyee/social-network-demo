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

export type CommentsViewType = {
    id: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string,
    likesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: 'None' | 'Like' | 'Dislike'
    }
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

export type LikesDislikesDbType = {
    commentId: string,
    userId: string,
    status: 'Like' | 'Dislike' | 'None'
}