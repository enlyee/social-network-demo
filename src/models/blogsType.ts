export type blogsOutputType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}
export type blogInputType = {
    name: string,
    description: string,
    websiteUrl: string
}
export type blogsDbType = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}