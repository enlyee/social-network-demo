import express, {Request, Response} from "express";
import {blogRouter} from "./routers/blogsRouter";
import {postsRouter} from "./routers/postsRouter";
import {
    BlogModel, CommentModel, DeviceAuthSessionModel, EmailConfirmationModel,
    PostModel, RateLimitIpModel, UserModel,
} from "./db/db";
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
    await BlogModel.deleteMany({})
    await PostModel.deleteMany({})
    await UserModel.deleteMany({})
    await CommentModel.deleteMany({})
    await RateLimitIpModel.deleteMany({})
    await DeviceAuthSessionModel.deleteMany({})
    await EmailConfirmationModel.deleteMany({})
    res.sendStatus(204)
    //todo: add new
});
app.use("/blogs", blogRouter)
app.use("/posts", postsRouter)
app.use('/auth', authRouter)
app.use('/users', usersRouter)
app.use('/comments', commentsRouter)
app.use('/security', securityRouter)