import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import {tokenRepository} from "../repositories/tokenRepository";

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET || "123"

export const jwtService = {
    async createJwtAccessToken(userId: string, refreshToken: string) {
        const inBlackList = await this.checkRefreshTokenInBlackList(refreshToken)
        if (inBlackList) {
            return null
        }
        return jwt.sign({userId: userId}, JWT_SECRET, {expiresIn: "10sec"})
    },
    async checkRefreshTokenInBlackList(token: string){
        return await tokenRepository.checkTokenInBlackList(token)
    },
    async createJwtRefreshToken(userId: string) {
        return jwt.sign({userId: userId}, JWT_SECRET, {expiresIn: "20sec"})
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, JWT_SECRET)
            return result.userId
        } catch (err) {
            return null
        }
    },
    async addTokenToBlackList(token: string) {
        await tokenRepository.addTokenToBlackList(token)
    }
}