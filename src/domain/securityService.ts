import {sessionRepository} from "../repositories/sessionRepository";
import {SessionMapper} from "../models/mappers/sessionMapper";

export const securityService = {
    async getAllDevices(userId: string) {
        const sessionsDbType = await sessionRepository.getAllSessions(userId)
        return sessionsDbType.map(SessionMapper)
    },
    async deleteAllSessionsExcludeThis(userId: string, deviceId: string) {
        const status = await sessionRepository.deleteAllSessionsExcludeThis(userId, deviceId)
        return !!status.deletedCount
    },
    async deleteSession(userId: string, deviceId: string) {
        const status = await sessionRepository.deleteSession(userId, deviceId)
        return status
    }
}