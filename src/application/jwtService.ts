import {SecurityRepository} from "../repositories/securityRepository";
import {AuthSessionsType} from "../models/authTypes";
import {randomUUID} from "crypto";
import {add} from "date-fns/add";
import {jwtAdapter} from "../adapters/jwtAdapter";
import {injectable} from "inversify";
const accessTokenExpires = 6000
const refreshTokenExpires = 60000

@injectable()
export class JwtService {
    constructor(protected sessionRepository: SecurityRepository) {}
    async createJwtAccessToken(userId: string) {
        return await jwtAdapter.createToken({userId: userId}, accessTokenExpires)
    }
    async createLoginJwtRefreshToken(userId: string, ip: string, deviceName: string) {
        const deviceId = randomUUID()
        const refreshToken = await jwtAdapter.createToken({userId: userId, deviceId: deviceId}, refreshTokenExpires)
        const date = await jwtAdapter.getTokenIssuing(refreshToken)
        const auth: AuthSessionsType = {
            userId: userId,
            ip: ip,
            deviceId: deviceId,
            title: deviceName,
            lastActiveDate: date!,
            expiresAt: add(date!, {seconds: refreshTokenExpires})
        }
        await this.sessionRepository.addAuthSession(auth)
        return refreshToken
    }
    async updateJwtRefreshToken(userId: string, deviceId: string, tokenIssuedDate: Date) {
        const sessionIssuedAt = await this.sessionRepository.getSessionIssuedAt(userId, deviceId)
        if ( (!sessionIssuedAt) || (sessionIssuedAt.toISOString() != tokenIssuedDate.toISOString())) {
            return null
        }
        const refreshToken = await jwtAdapter.createToken({userId: userId, deviceId: deviceId}, refreshTokenExpires)
        const date = await jwtAdapter.getTokenIssuing(refreshToken)
        const status = await this.sessionRepository.updateAuthSession(userId, deviceId, date!)
        if (!status) {
            return null
        }
        return refreshToken
    }
}