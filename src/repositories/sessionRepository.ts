import {AuthSessionsType} from "../models/authTypes";
import {add} from "date-fns/add";
import {DeviceAuthSessionModel} from "../db/db";


class SessionRepository {
    async addAuthSession(auth: AuthSessionsType) {
        await DeviceAuthSessionModel.create(auth)
    }
    async updateAuthSession(userId: string, deviceId: string, date: Date) {
        const status = await DeviceAuthSessionModel.updateOne({
                $and: [
                    {userId: userId},
                    {deviceId: deviceId}]},
            {
                lastActiveDate: date,
                expiresAt: add(date, {seconds: 20})})
        return !!status.matchedCount
    }
    async deleteSession(userId: string, deviceId: string){
        const status = await DeviceAuthSessionModel.deleteOne({$and: [{userId: userId}, {deviceId: deviceId}]})
        return !!status.deletedCount
    }
    async getUserIdDeviceOwner(deviceId: string) {
        const session = await DeviceAuthSessionModel.findOne({deviceId: deviceId}).lean()
        if (!session) return null
        return session.userId
    }
    async getAllSessions(userId: string) {
        return DeviceAuthSessionModel.find({userId: userId}).lean()
    }
    async deleteAllSessionsExcludeThis(userId: string, deviceId: string) {
        return DeviceAuthSessionModel.deleteMany({$and: [{userId: userId}, {deviceId: {$ne: deviceId}}]})
    }
    async getSessionIssuedAt(userId: string, deviceId: string) {
        return (await DeviceAuthSessionModel.findOne({$and: [{userId: userId}, {deviceId: deviceId}]}).lean())?.lastActiveDate
    }
}

export const sessionRepository = new SessionRepository()