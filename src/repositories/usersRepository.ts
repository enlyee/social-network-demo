import {blogsCollection, usersCollection} from "../db/runDb";
import {FindParamsUsersType, UsersDbType} from "../models/usersTypes";
import {UsersMapper} from "../models/mappers/usersMapper";
import {QueryGetUsersType} from "../models/commonType";
import {ObjectId} from "mongodb";

export const usersRepository = {
    async findUserByLoginOrEmail(login: string) {
        return await usersCollection.findOne({$or: [{email: login}, {login: login}]})
    },
    async createUser(user: UsersDbType) {
        const newUser = await usersCollection.insertOne(user)
        return UsersMapper({
            _id: newUser.insertedId,
            ...user
        })
    },
    async findUsers(findParams: FindParamsUsersType) {
        const collectionSize = (await usersCollection
            .find({$or:[{login: new RegExp(findParams.searchLoginTerm, 'i')}, {email: new RegExp(findParams.searchEmailTerm, 'i')}]})
            .toArray()).length
        console.log((await usersCollection
            .find({})
            .toArray()))
        const users = await usersCollection
            .find({$or:[{login: new RegExp(findParams.searchLoginTerm, 'i')}, {email: new RegExp(findParams.searchEmailTerm, 'i')}]})
            .sort(findParams.sortBy, findParams.sortDirection).skip((findParams.pageNumber-1)*findParams.pageSize).limit(+findParams.pageSize)
            .toArray()
        return {collectionSize, users}
    },
    async deleteUser(id: string) {
        const index = await usersCollection.deleteOne({_id: new ObjectId(id)})
        return !!index.deletedCount
    }
}