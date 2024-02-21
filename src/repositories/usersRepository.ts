import {FindParamsUsersType, UsersDbType} from "../models/usersTypes";
import {UsersFindManyMapper} from "../models/mappers/usersMapper";
import {ObjectId} from "mongodb";
import {UserModel} from "../db/db";


class UsersRepository {
    async findUserByLoginOrEmail(login: string) {
        return UserModel.findOne({$or: [{email: login}, {login: login}]})
    }
    async createUser(user: UsersDbType) {
        const newUser = await UserModel.create(user)
        return UsersFindManyMapper({
            _id: newUser._id,
            ...user
        })
    }
    async findUsers(findParams: FindParamsUsersType) {
        const collectionSize = (await UserModel
            .find({$or:[{login: new RegExp(findParams.searchLoginTerm, 'i')}, {email: new RegExp(findParams.searchEmailTerm, 'i')}]})
            .lean()).length
        const users = await UserModel
            .find({$or:[{login: new RegExp(findParams.searchLoginTerm, 'i')}, {email: new RegExp(findParams.searchEmailTerm, 'i')}]})
            .sort({[findParams.sortBy]: findParams.sortDirection}).skip((findParams.pageNumber-1)*findParams.pageSize).limit(+findParams.pageSize)
            .lean()
        return {collectionSize, users}
    }
    async deleteUser(id: string) {
        const index = await UserModel.deleteOne({_id: new ObjectId(id)})
        return !!index.deletedCount
    }
    async findUserById(id: string) {
        return UserModel.findOne({_id: new ObjectId(id)})
    }
}

export const usersRepository = new UsersRepository()