import {WithId} from "mongodb";
import {UserMeType, UsersDbType, UsersOutputType} from "../usersTypes";

export const UsersFindManyMapper = (user: WithId<UsersDbType>): UsersOutputType => {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}
export const UsersFindMeMapper = (user: WithId<UsersDbType>): UserMeType => {
    return {
        email: user.email,
        login: user.login,
        userId: user._id.toString()
    }
}