import {EmailConfirmationType} from "../models/usersTypes";
import {emailConfirmationCollection, usersCollection} from "../db/runDb";
import {ObjectId} from "mongodb";

export const authRepository = {
    async createConfirmation(confirmation: EmailConfirmationType) {
        await emailConfirmationCollection.insertOne(confirmation)
    },
    async getConfirmation(code: string){
        const confCode = await emailConfirmationCollection.findOne({confirmationCode: code})
        return confCode
    },
    async deleteConfirmationByCode(code: string){
        await emailConfirmationCollection.findOneAndDelete({confirmationCode: code})
    },
    async deleteConfirmationByUserId(userId: string){
        await emailConfirmationCollection.findOneAndDelete({userId: userId})
    },
    async userConfirmated(userId: string) {
        await usersCollection.updateOne({_id: new ObjectId(userId)}, {$set: {isConfirmed: true}})
    },
    async getUserConfirmationStatusByEmail(email: string) {
        const user = await usersCollection.findOne({email: email})
        if (!user) {
            return 'notExist'
        }
        return user.isConfirmed
    },
    async getUserIdByEmail(email: string) {
        const user = await usersCollection.findOne({email: email})
        return user?._id.toString()
    }
}