import {blogsOutputType} from "./blogsType";
import { postsOutputType } from "./postsType";


export type DbType = {
    blogs: blogsOutputType[],
    posts: postsOutputType[]
}