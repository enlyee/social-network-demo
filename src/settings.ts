import express, {Request, Response} from "express";
import {blogRouter} from "./routers/blog-router";
import {postRouter} from "./routers/post-router";
import {blogsCollection, postsCollection} from "./db/runDb";

export const app = express()

app.use(express.json())

app.delete("/testing/all-data", async (req: Request, res: Response) => {
    await blogsCollection.deleteMany({})
    await postsCollection.deleteMany({})
    res.sendStatus(204)
});
app.use("/blogs", blogRouter)
app.use("/posts", postRouter)