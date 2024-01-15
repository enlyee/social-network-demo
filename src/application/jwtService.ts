import {UsersDbType, UsersInputType, UsersOutputType} from "../models/usersTypes";
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
import {ObjectId} from "mongodb";
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET || "123"

export const jwtService = {
    async createJwt(userId: string) {
        const token = jwt.sign({userId: userId}, JWT_SECRET, {expiresIn: "2min"})
        return token
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, JWT_SECRET)
            return result.userId
        } catch (err) {
            return null
        }
    }
}