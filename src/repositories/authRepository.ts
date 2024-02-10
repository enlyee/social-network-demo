import {EmailConfirmationType} from "../models/usersTypes";
import {ObjectId} from "mongodb";
import {EmailConfirmationModel, UserModel} from "../db/db";

export const authRepository = {
    async createConfirmation(confirmation: EmailConfirmationType) {
        await EmailConfirmationModel.create(confirmation)
    },
    async getConfirmation(code: string){
        return EmailConfirmationModel.findOne({confirmationCode: code}).lean()
    },
    async deleteConfirmationByCode(code: string){
        await EmailConfirmationModel.findOneAndDelete({confirmationCode: code})
    },
    async deleteConfirmationByUserId(userId: string){
        await EmailConfirmationModel.findOneAndDelete({userId: userId})
    },
    async userConfirmated(userId: string) {
        await UserModel.updateOne({_id: new ObjectId(userId)}, {$set: {isConfirmed: true}})
    },
    async getUserConfirmationStatusByEmail(email: string) {
        const user = await UserModel.findOne({email: email}).lean()
        if (!user) {
            return 'notExist'
        }
        return user.isConfirmed
    },
    async getUserIdByEmail(email: string) {
        const user = await UserModel.findOne({email: email}).lean()
        return user?._id.toString()
    }
}