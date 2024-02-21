import {sessionRepository} from "../repositories/sessionRepository";
import {AuthSessionsType} from "../models/authTypes";
import {randomUUID} from "crypto";
import {add} from "date-fns/add";
import {jwtAdapter} from "../adapters/jwtAdapter";
const accessTokenExpires = 6000
const refreshTokenExpires = 60000


class JwtService {
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
        await sessionRepository.addAuthSession(auth)
        return refreshToken
    }
    async updateJwtRefreshToken(userId: string, deviceId: string, tokenIssuedDate: Date) {
        const sessionIssuedAt = await sessionRepository.getSessionIssuedAt(userId, deviceId)
        if ( (!sessionIssuedAt) || (sessionIssuedAt.toISOString() != tokenIssuedDate.toISOString())) {
            return null
        }
        const refreshToken = await jwtAdapter.createToken({userId: userId, deviceId: deviceId}, refreshTokenExpires)
        const date = await jwtAdapter.getTokenIssuing(refreshToken)
        const status = await sessionRepository.updateAuthSession(userId, deviceId, date!)
        if (!status) {
            return null
        }
        return refreshToken
    }
}
export const jwtService = new JwtService()