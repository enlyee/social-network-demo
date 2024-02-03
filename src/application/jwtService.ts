import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import {sessionRepository} from "../repositories/sessionRepository";
import {AuthSessionsType} from "../models/authTypes";
import {randomUUID} from "crypto";
import {add} from "date-fns/add";

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET || "123"

export const jwtService = {
    async createJwtAccessToken(userId: string) {
        return jwt.sign({userId: userId}, JWT_SECRET, {expiresIn: "10sec"})
    },
    async createLoginJwtRefreshToken(userId: string, ip: string, deviceName: string) {
        const deviceId = randomUUID()
        const token = jwt.sign({userId: userId, deviceId: deviceId}, JWT_SECRET, {expiresIn: "20sec"})
        const date = await this.getTokenIssuing(token)
        const auth: AuthSessionsType = {
            userId: userId,
            ip: ip,
            deviceId: deviceId,
            title: deviceName,
            lastActiveDate: date!,
            expiresAt: add(date!, {seconds: 20})
        }
        await sessionRepository.addAuthSession(auth)
        return token
    },
    async updateJwtRefreshToken(userId: string, deviceId: string, tokenIssuedDate: Date) {
        const sessionIssuedAt = await sessionRepository.getSessionIssuedAt(userId, deviceId)
        if ( (!sessionIssuedAt) || (sessionIssuedAt > tokenIssuedDate)) {
            return null
        }
        const token = jwt.sign({userId: userId, deviceId: deviceId}, JWT_SECRET, {expiresIn: "20sec"})
        const date = await this.getTokenIssuing(token)
        const status = await sessionRepository.updateAuthSession(userId, deviceId, date!)
        if (!status) {
            return null
        }

        return token
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, JWT_SECRET)
            return result.userId
        } catch (err) {
            return null
        }
    },
    async getUserIdAndDeviceByToken(token: string) {
        try {
            const result: any = jwt.verify(token, JWT_SECRET)
            return result
        } catch (err) {
            return null
        }
    },
    async getTokenIssuing(token: string) {
        try {
            const result: any = jwt.verify(token, JWT_SECRET)
            return new Date(result.iat.toString()*1000)
        } catch (err) {
            return null
        }

    }
}