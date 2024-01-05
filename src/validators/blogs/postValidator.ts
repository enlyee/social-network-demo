import {body} from "express-validator";
import {blogsCollection} from "../../db/runDb";
import {ObjectId} from "mongodb";

export const postTitleValidator = body('title').trim().isLength({min: 1, max: 30})
export const postDescriptionValidator = body('shortDescription').trim().isLength({min: 1, max: 100})
export const postContentValidator = body('content').trim().isLength({min: 1, max: 100})
export const postBlogIdIsExists = body('blogId').custom(async (v) => {
    let blogId = await blogsCollection.findOne({_id: new ObjectId(v)})
    if (!blogId) {
        throw new Error ("This blogId doesn't exist")
    }
    return true
})