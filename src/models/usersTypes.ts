export type UsersDbType = {
    login: string,
    email: string,
    passwordHash: string,
    passwordSalt: string,
    createdAt: string
}

export type UsersOutputType = {
    id: string,
    login: string,
    email: string,
    createdAt: string
}

export type UsersInputType = {
    login: string,
    email: string,
    password: string
}

export type FindParamsUsersType = {
    searchLoginTerm: string,
    searchEmailTerm: string,
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageNumber: number,
    pageSize: number
}