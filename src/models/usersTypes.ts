export type UsersDbType = {
    login: string,
    email: string,
    passwordHash: string,
    passwordSalt: string,
    isConfirmed: boolean,
    createdAt: string
}

export type EmailConfirmationType = {
    userId: string,
    confirmationCode: string,
    expirationDate: Date
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

export type UserMeType = {
    email: string,
    login: string,
    userId: string
}