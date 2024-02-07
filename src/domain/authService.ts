import {usersRepository} from "../repositories/usersRepository";
import bcrypt from "bcryptjs";
import {EmailConfirmationType, UsersDbType} from "../models/usersTypes";
import {v4 as uuidv4} from 'uuid';
import {add} from "date-fns/add";
import {authRepository} from "../repositories/authRepository";
import {sessionRepository} from "../repositories/sessionRepository";
import {emailManager} from "../managers/emailManager";

export const authService = {
    async checkCredentials(login: string, password: string){
        const user = await usersRepository.findUserByLoginOrEmail(login)

        if (!user) {
            return false
        }

        const passwordHash = await this.generateHash(password, user.passwordSalt)
        if (user.passwordHash === passwordHash) {
            return user._id.toString()
        } else {
            return false
        }

    },
    async generateHash(password: string, salt: string): Promise<string> {
        return await bcrypt.hash(password, salt)
    },
    async createUser(login: string, password: string, email: string) {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await authService.generateHash(password, passwordSalt)
        const user: UsersDbType = {
            login: login,
            email: email,
            passwordHash: passwordHash,
            passwordSalt: passwordSalt,
            createdAt: (new Date()).toISOString(),
            isConfirmed: false
        }
        const userID = (await usersRepository.createUser(user)).id
        const emailConfirmationData: EmailConfirmationType = {
            userId: userID,
            confirmationCode: uuidv4(),
            expirationDate: add(new Date(), {
                minutes: 3
            }),
        }
        await authRepository.createConfirmation(emailConfirmationData)
        await emailManager.emailConfirmation(email, emailConfirmationData.confirmationCode)
    },
    async emailConfirmation(code: string) {
        const userID = (await authRepository.getConfirmation(code))?.userId
        await authRepository.userConfirmated(userID!)
        await authRepository.deleteConfirmationByCode(code)
    },
    async resendEmail(email: string) {
        const userId = await authRepository.getUserIdByEmail(email)
        await authRepository.deleteConfirmationByUserId(userId!)
        const emailConfirmationData: EmailConfirmationType = {
            userId: userId!,
            confirmationCode: uuidv4(),
            expirationDate: add(new Date(), {
                minutes: 3
            }),
        }
        await authRepository.createConfirmation(emailConfirmationData)
        await emailManager.emailConfirmation(email, emailConfirmationData.confirmationCode)
    },
    async deleteSession(userId: string, deviceId: string, tokenIssuedDate: Date){
        const sessionIssuedAt = await sessionRepository.getSessionIssuedAt(userId, deviceId)
        if ( (!sessionIssuedAt) || (sessionIssuedAt.toISOString() != tokenIssuedDate.toISOString())) {
            return null
        }
        return sessionRepository.deleteSession(userId, deviceId)
    }

 }