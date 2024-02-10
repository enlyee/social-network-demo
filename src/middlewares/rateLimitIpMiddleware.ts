import {NextFunction, Request, Response} from "express";
import {RateLimitIpType} from "../models/authTypes";
import {sub} from "date-fns/sub";
import {RateLimitIpModel} from "../db/db";
export const RateLimitIpMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const userData: RateLimitIpType = {
        ip: req.ip!,
        url: req.originalUrl,
        date: new Date()
    }
    await RateLimitIpModel.create(userData)
    const attempts = (await RateLimitIpModel.find({$and:
            [
                {ip: userData.ip},
                {url: userData.url},
                {date: {$gt: sub(new Date(), {seconds: 10})}}
            ], }).lean()).length
    if (attempts>5){
        res.sendStatus(429)
        return
    }
    await RateLimitIpModel.deleteMany({date: {$lt: sub(new Date(), {seconds: 10})}})
    next()
}