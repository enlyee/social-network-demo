import {EmailConfirmationType} from "../models/usersTypes";
import {ObjectId} from "mongodb";
import {EmailConfirmationModel, PasswordRecoveryModel, UserModel} from "../db/db";
import {PasswordRecoveryType} from "../models/authTypes";

class AuthRepository {
    async createConfirmation(confirmation: EmailConfirmationType) {
        await EmailConfirmationModel.create(confirmation)
    }
    async getConfirmation(code: string){
        return EmailConfirmationModel.findOne({confirmationCode: code}).lean()
    }
    async deleteConfirmationByCode(code: string){
        await EmailConfirmationModel.findOneAndDelete({confirmationCode: code})
    }
    async deleteConfirmationByUserId(userId: string){
        await EmailConfirmationModel.findOneAndDelete({userId: userId})
    }
    async userConfirmated(userId: string) {
        await UserModel.updateOne({_id: new ObjectId(userId)}, {$set: {isConfirmed: true}})
    }
    async getUserConfirmationStatusByEmail(email: string) {
        const user = await UserModel.findOne({email: email}).lean()
        if (!user) {
            return 'notExist'
        }
        return user.isConfirmed
    }
    async getUserIdByEmail(email: string) {
        const user = await UserModel.findOne({email: email}).lean()
        return user?._id.toString()
    }
    async createPasswordRecovery(recovery: PasswordRecoveryType){
        await PasswordRecoveryModel.create(recovery)
        await PasswordRecoveryModel.deleteMany({expirationDate: {$lt: new Date()}})
    }
    async isEmailRegistred(email: string){
        return !!(await UserModel.findOne({email: email}).lean())
    }
    async getUpdatePasswordCode(code: string) {
        const status = await PasswordRecoveryModel.findOne({code: code}).lean()
        if (!status) return false
        return (new Date() <= status.expirationDate)
    }
    async updatePasswordByCode(code: string, passwordSalt: string, passwordHash: string){
        const confirmation = (await PasswordRecoveryModel.findOne({code: code}).lean())
        if (!confirmation) return false
        await PasswordRecoveryModel.deleteOne({code: code})
        await UserModel.updateOne({email: confirmation.email}, {passwordHash: passwordHash, passwordSalt: passwordSalt})
        return true
    }
}
export const authRepository = new AuthRepository()