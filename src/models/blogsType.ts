export type BlogsOutputType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}
export type BlogInputType = {
    name: string,
    description: string,
    websiteUrl: string
}
export type BlogsDbType = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type QueryBlogsOutputType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: BlogsOutputType[]
}