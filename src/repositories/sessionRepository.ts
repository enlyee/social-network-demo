import {deviceAuthSessions} from "../db/runDb";
import {AuthSessionsType} from "../models/authTypes";
import {add} from "date-fns/add";

export const sessionRepository = {
    async addAuthSession(auth: AuthSessionsType) {
        await deviceAuthSessions.insertOne(auth)
    },
    async updateAuthSession(userId: string, deviceId: string, date: Date) {
        const status = await deviceAuthSessions.updateOne({$and: [{userId: userId}, {deviceId: deviceId}]},
            {$set: {lastActiveDate: date, expiresAt: add(date, {seconds: 20})}})
        return !!status.matchedCount
    },
    async deleteSession(userId: string, deviceId: string){
        const status = await deviceAuthSessions.deleteOne({$and: [{userId: userId}, {deviceId: deviceId}]})
        return !!status.deletedCount
    },
    async getAllSessions(userId: string) {
        return await deviceAuthSessions.find({userId: userId}).toArray()
    },
    async deleteAllSessionsExcludeThis(userId: string, deviceId: string) {
        return await deviceAuthSessions.deleteMany({$and: [{userId: userId}, {deviceId: {$ne: deviceId}}]})
    },
    async getSessionIssuedAt(userId: string, deviceId: string) {
        return (await deviceAuthSessions.findOne({$and: [{userId: userId}, {deviceId: deviceId}]}))?.lastActiveDate
    }
}