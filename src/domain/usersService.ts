import bcrypt, {hash} from 'bcryptjs'
import {usersRepository} from "../repositories/usersRepository";
import {QueryGetUsersType} from "../models/commonType";
import {EmailConfirmationType, FindParamsUsersType, UserMeType, UsersDbType} from "../models/usersTypes";
import {blogsCollection} from "../db/runDb";
import {BlogMapper} from "../models/mappers/blogsMapper";
import {UsersFindManyMapper, UsersFindMeMapper} from "../models/mappers/usersMapper";
import {jwtService} from "../application/jwtService";
import {authService} from "./authService";
import {v4 as uuidv4} from "uuid";
import {add} from "date-fns/add";
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
        const passwordHash = await authService.generateHash(password, passwordSalt)
        const user: UsersDbType = {
            login: login,
            email: email,
            passwordHash: passwordHash,
            passwordSalt: passwordSalt,
            createdAt: (new Date()).toISOString(),
            isConfirmed: true
        }
        return await usersRepository.createUser(user)
    },
    async deleteUser(id: string) {
        return await usersRepository.deleteUser(id)
    },
    async findUserById(userId: string): Promise<UserMeType> {
        const user: any = await usersRepository.findUserById(userId)
        return UsersFindMeMapper(user)
    }
}