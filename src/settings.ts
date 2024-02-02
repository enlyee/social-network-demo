import express, {Request, Response} from "express";
import {blogRouter} from "./routers/blogRouter";
import {postRouter} from "./routers/postRouter";
import {
    blogsCollection,
    commentsCollection,
    postsCollection, rateLimitIpCollection,
    usersCollection
} from "./db/runDb";
import {authRouter} from "./routers/authRouter";
import {usersRouter} from "./routers/usersRouter";
import {commentsRouter} from "./routers/commentsRouter";
import cookieParser from "cookie-parser";
import {securityRouter} from "./routers/securityRouter";

export const app = express()

app.use(express.json())
app.use(cookieParser())
app.set('trust proxy', true)

app.delete("/testing/all-data", async (req: Request, res: Response) => {
    await blogsCollection.deleteMany({})
    await postsCollection.deleteMany({})
    await usersCollection.deleteMany({})
    await commentsCollection.deleteMany({})
    await rateLimitIpCollection.deleteMany({})
    res.sendStatus(204)
});
app.use("/blogs", blogRouter)
app.use("/posts", postRouter)
app.use('/auth', authRouter)
app.use('/users', usersRouter)
app.use('/comments', commentsRouter)
app.use('/security', securityRouter)