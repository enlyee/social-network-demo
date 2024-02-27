import {UsersRepository} from "../repositories/usersRepository";
import bcrypt from "bcryptjs";
import {EmailConfirmationType, UsersDbType} from "../models/usersTypes";
import {v4 as uuidv4} from 'uuid';
import {add} from "date-fns/add";
import {emailManager} from "../managers/emailManager";
import {PasswordRecoveryType} from "../models/authTypes";
import {bcryptAdapter} from "../adapters/bcryptAdapter";
import {SecurityRepository} from "../repositories/securityRepository";
import {AuthRepository} from "../repositories/authRepository";
import {injectable} from "inversify";
@injectable()
export class AuthService {

    constructor(protected sessionRepository: SecurityRepository,
                protected usersRepository: UsersRepository,
                protected authRepository: AuthRepository) {}
    async checkCredentials(login: string, password: string){
        const user = await this.usersRepository.findUserByLoginOrEmail(login)

        if (!user) {
            return false
        }

        const passwordHash = await bcryptAdapter.generateHash(password, user.passwordSalt)
        if (user.passwordHash === passwordHash) {
            return user._id.toString()
        } else {
            return false
        }

    }
    async createUser(login: string, password: string, email: string) {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await bcryptAdapter.generateHash(password, passwordSalt)
        const user: UsersDbType = {
            login: login,
            email: email,
            passwordHash: passwordHash,
            passwordSalt: passwordSalt,
            createdAt: (new Date()).toISOString(),
            isConfirmed: false
        }
        const userID = (await this.usersRepository.createUser(user)).id
        const emailConfirmationData: EmailConfirmationType = {
            userId: userID,
            confirmationCode: uuidv4(),
            expirationDate: add(new Date(), {
                minutes: 3
            }),
        }
        await this.authRepository.createConfirmation(emailConfirmationData)
        await emailManager.emailConfirmation(email, emailConfirmationData.confirmationCode)
    }
    async emailConfirmation(code: string) {
        const userID = (await this.authRepository.getConfirmation(code))?.userId
        await this.authRepository.userConfirmated(userID!)
        await this.authRepository.deleteConfirmationByCode(code)
    }
    async resendEmail(email: string) {
        const userId = await this.authRepository.getUserIdByEmail(email)
        await this.authRepository.deleteConfirmationByUserId(userId!)
        const emailConfirmationData: EmailConfirmationType = {
            userId: userId!,
            confirmationCode: uuidv4(),
            expirationDate: add(new Date(), {
                minutes: 3
            }),
        }
        await this.authRepository.createConfirmation(emailConfirmationData)
        await emailManager.emailConfirmation(email, emailConfirmationData.confirmationCode)
    }
    async deleteSession(userId: string, deviceId: string, tokenIssuedDate: Date){
        const sessionIssuedAt = await this.sessionRepository.getSessionIssuedAt(userId, deviceId)
        if ( (!sessionIssuedAt) || (sessionIssuedAt.toISOString() != tokenIssuedDate.toISOString())) {
            return null
        }
        return this.sessionRepository.deleteSession(userId, deviceId)
    }
    async sendPasswordRecoveryEmail(email: string) {
        const isRegistred = await this.authRepository.isEmailRegistred(email)
        if (!isRegistred) return
        const code = uuidv4()
        const passwordRecoveryData: PasswordRecoveryType = {
            email: email,
            code: code,
            expirationDate: add(new Date(), {
                minutes: 3
            }),
        }
        await this.authRepository.createPasswordRecovery(passwordRecoveryData)
        await emailManager.passwordRecovery(email, code)
    }
    async setNewPasswordToUser(code: string, password: string){
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await bcryptAdapter.generateHash(password, passwordSalt)
        await this.authRepository.updatePasswordByCode(code, passwordSalt, passwordHash)
    }
}