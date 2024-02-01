import {NextFunction, Request, Response} from "express";
import {rateLimitIpCollection} from "../db/runDb";
import {RateLimitIpType} from "../models/rateLimitIpType";
import {sub} from "date-fns/sub";
export const RateLimitIpMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const userData: RateLimitIpType = {
        ip: req.ip!,
        url: req.originalUrl,
        date: new Date()
    }
    await rateLimitIpCollection.insertOne(userData)
    const attempts = (await rateLimitIpCollection.find({$and:
            [
                {ip: userData.ip},
                {url: userData.url},
                {date: {$gt: sub(new Date(), {seconds: 10})}}
            ], }).toArray()).length
    if (attempts>5){
        res.sendStatus(429)
        return
    }
    await rateLimitIpCollection.deleteMany({date: {$lt: sub(new Date(), {seconds: 10})}})
    next()
}