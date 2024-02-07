import {deviceAuthSessionsCollection} from "../db/db";
import {AuthSessionsType} from "../models/authTypes";
import {add} from "date-fns/add";

export const sessionRepository = {
    async addAuthSession(auth: AuthSessionsType) {
        await deviceAuthSessionsCollection.insertOne(auth)
    },
    async updateAuthSession(userId: string, deviceId: string, date: Date) {
        const status = await deviceAuthSessionsCollection.updateOne({$and: [{userId: userId}, {deviceId: deviceId}]},
            {$set: {lastActiveDate: date, expiresAt: add(date, {seconds: 20})}})
        return !!status.matchedCount
    },
    async deleteSession(userId: string, deviceId: string){
        const status = await deviceAuthSessionsCollection.deleteOne({$and: [{userId: userId}, {deviceId: deviceId}]})
        return !!status.deletedCount
    },
    async getUserIdDeviceOwner(deviceId: string) {
        const session = await deviceAuthSessionsCollection.findOne({deviceId: deviceId})
        if (!session) return null
        return session.userId
    },
    async getAllSessions(userId: string) {
        return await deviceAuthSessionsCollection.find({userId: userId}).toArray()
    },
    async deleteAllSessionsExcludeThis(userId: string, deviceId: string) {
        return await deviceAuthSessionsCollection.deleteMany({$and: [{userId: userId}, {deviceId: {$ne: deviceId}}]})
    },
    async getSessionIssuedAt(userId: string, deviceId: string) {
        return (await deviceAuthSessionsCollection.findOne({$and: [{userId: userId}, {deviceId: deviceId}]}))?.lastActiveDate
    }
}