import {SessionMapper} from "../models/mappers/sessionMapper";
import {SecurityRepository} from "../repositories/securityRepository";
import {injectable} from "inversify";
@injectable()
export class SecurityService {
    constructor(protected sessionRepository: SecurityRepository) {}
    async getAllDevices(userId: string) {
        const sessionsDbType = await this.sessionRepository.getAllSessions(userId)
        return sessionsDbType.map(SessionMapper)
    }
    async deleteAllSessionsExcludeThis(userId: string, deviceId: string) {
        const status = await this.sessionRepository.deleteAllSessionsExcludeThis(userId, deviceId)
        return !!status.deletedCount
    }
    async deleteSession(userId: string, deviceId: string) {
        const userIdDeviceOwner = await this.sessionRepository.getUserIdDeviceOwner(deviceId)
        if (!userIdDeviceOwner) return 404
        if (userIdDeviceOwner !== userId) return 403
        return await this.sessionRepository.deleteSession(userId, deviceId)
    }
}