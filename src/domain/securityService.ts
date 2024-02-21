import {sessionRepository} from "../repositories/sessionRepository";
import {SessionMapper} from "../models/mappers/sessionMapper";

class SecurityService {
    async getAllDevices(userId: string) {
        const sessionsDbType = await sessionRepository.getAllSessions(userId)
        return sessionsDbType.map(SessionMapper)
    }
    async deleteAllSessionsExcludeThis(userId: string, deviceId: string) {
        const status = await sessionRepository.deleteAllSessionsExcludeThis(userId, deviceId)
        return !!status.deletedCount
    }
    async deleteSession(userId: string, deviceId: string) {
        const userIdDeviceOwner = await sessionRepository.getUserIdDeviceOwner(deviceId)
        if (!userIdDeviceOwner) return 404
        if (userIdDeviceOwner !== userId) return 403
        return await sessionRepository.deleteSession(userId, deviceId)
    }
}
export const securityService = new SecurityService()