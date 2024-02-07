import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET || "123"

export const jwtAdapter = {
    async createToken(payload: object, expiresIn: number) {
        return jwt.sign(payload, JWT_SECRET, {expiresIn: `${expiresIn}sec`})
    },
    async getTokenPayload(token: string) {
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