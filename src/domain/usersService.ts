import bcrypt, {hash} from 'bcryptjs'
import {usersRepository} from "../repositories/usersRepository";
import {QueryGetUsersType} from "../models/commonType";
import {FindParamsUsersType, UserMeType, UsersDbType} from "../models/usersTypes";
import {blogsCollection} from "../db/runDb";
import {BlogMapper} from "../models/mappers/blogsMapper";
import {UsersFindManyMapper, UsersFindMeMapper} from "../models/mappers/usersMapper";
import {jwtService} from "../application/jwtService";
const sortingUsersName = ['login', 'email', 'createdAt']
export const usersService = {
    async findUsers(query: QueryGetUsersType){
        const findParams: FindParamsUsersType = {
            searchLoginTerm: query.searchLoginTerm || '',
            searchEmailTerm: query.searchEmailTerm || '',
            sortBy: (query.sortBy) ? (sortingUsersName.includes(query.sortBy)) ? (query.sortBy) : 'createdAt' : 'createdAt',
            sortDirection: query.sortDirection || 'desc',
            pageNumber: query.pageNumber || 1,
            pageSize: query.pageSize || 10
        }
        const {collectionSize, users} = await usersRepository.findUsers(findParams)


        return {
            pagesCount: Math.ceil(collectionSize/findParams.pageSize),
            page: +findParams.pageNumber,
            pageSize: +findParams.pageSize,
            totalCount: collectionSize,
            items: users.map(UsersFindManyMapper)
        }
    },
    async createUser(login: string, email: string, password: string) {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        const user: UsersDbType = {
            login: login,
            email: email,
            passwordHash: passwordHash,
            passwordSalt: passwordSalt,
            createdAt: (new Date()).toISOString()
        }
        return await usersRepository.createUser(user)
    },
    async checkCredentials(login: string, password: string){
        const user = await usersRepository.findUserByLoginOrEmail(login)

        if (!user) {
            return false
        }

        const passwordHash = await this._generateHash(password, user.passwordSalt)
        if (user.passwordHash === passwordHash) {
            return user._id.toString()
        } else {
            return false
        }

    },
    async _generateHash(password: string, salt: string): Promise<string> {
        return await bcrypt.hash(password, salt)
    },
    async deleteUser(id: string) {
        return await usersRepository.deleteUser(id)
    },
    async findUserById(userId: string): Promise<UserMeType> {
        const user: any = await usersRepository.findUserById(userId)
        return UsersFindMeMapper(user)
    }
}