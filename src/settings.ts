import express, {Request, Response} from "express";
import {blogRouter} from "./routers/blogRouter";
import {postRouter} from "./routers/postRouter";
import {
    blogsCollection,
    commentsCollection,
    postsCollection,
    tokensBlackListCollection,
    usersCollection
} from "./db/runDb";
import {authRouter} from "./routers/authRouter";
import {usersRouter} from "./routers/usersRouter";
import {commentsRouter} from "./routers/commentsRouter";
import cookieParser from "cookie-parser";

export const app = express()

app.use(express.json())
app.use(cookieParser())

app.delete("/testing/all-data", async (req: Request, res: Response) => {
    await blogsCollection.deleteMany({})
    await postsCollection.deleteMany({})
    await usersCollection.deleteMany({})
    await commentsCollection.deleteMany({})
    await tokensBlackListCollection.deleteMany({})
    res.sendStatus(204)
});
app.use("/blogs", blogRouter)
app.use("/posts", postRouter)
app.use('/auth', authRouter)
app.use('/users', usersRouter)
app.use('/comments', commentsRouter)