import bcrypt from 'bcryptjs'
import {UsersRepository} from "../repositories/usersRepository";
import {QueryGetUsersType} from "../models/commonType";
import {FindParamsUsersType, UserMeType, UsersDbType} from "../models/usersTypes";
import {UsersFindManyMapper, UsersFindMeMapper} from "../models/mappers/usersMapper";
import {bcryptAdapter} from "../adapters/bcryptAdapter";
import {injectable} from "inversify";
const sortingUsersName = ['login', 'email', 'createdAt']

@injectable()
export class UsersService {
    constructor(protected usersRepository: UsersRepository) {}
    async findUsers(query: QueryGetUsersType){
        const findParams: FindParamsUsersType = {
            //TODO вынести
            searchLoginTerm: query.searchLoginTerm || '',
            searchEmailTerm: query.searchEmailTerm || '',
            sortBy: (query.sortBy) ? (sortingUsersName.includes(query.sortBy)) ? (query.sortBy) : 'createdAt' : 'createdAt',
            sortDirection: query.sortDirection || 'desc',
            pageNumber: query.pageNumber || 1,
            pageSize: query.pageSize || 10
        }
        const {collectionSize, users} = await this.usersRepository.findUsers(findParams)


        return {
            pagesCount: Math.ceil(collectionSize/findParams.pageSize),
            page: +findParams.pageNumber,
            pageSize: +findParams.pageSize,
            totalCount: collectionSize,
            items: users.map(UsersFindManyMapper)
        }
    }
    async createUser(login: string, email: string, password: string) {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await bcryptAdapter.generateHash(password, passwordSalt)
        const user: UsersDbType = {
            login: login,
            email: email,
            passwordHash: passwordHash,
            passwordSalt: passwordSalt,
            createdAt: (new Date()).toISOString(),
            isConfirmed: true
        }
        return this.usersRepository.createUser(user)
    }
    async deleteUser(id: string) {
        return this.usersRepository.deleteUser(id)
    }
    async findUserById(userId: string): Promise<UserMeType> {
        const user: any = await this.usersRepository.findUserById(userId)
        return UsersFindMeMapper(user)
    }

}