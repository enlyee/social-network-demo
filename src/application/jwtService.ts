import {UsersDbType, UsersInputType, UsersOutputType} from "../models/usersTypes";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import {ObjectId} from "mongodb";
import {tokenRepository} from "../repositories/tokenRepository";
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET || "123"

export const jwtService = {
    async createJwtAccessToken(userId: string, refreshToken: string) {
        const status = await tokenRepository.checkTokenInBlackList(refreshToken)
        if (status) {
            return null
        }
        const token = jwt.sign({userId: userId}, JWT_SECRET, {expiresIn: "10sec"})
        return token
    },
    async createJwtRefreshToken(userId: string) {
        const token = jwt.sign({userId: userId}, JWT_SECRET, {expiresIn: "20sec"})
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
    async addTokenToBlackList(token: string) {
        await tokenRepository.addTokenToBlackList(token)
    }
}