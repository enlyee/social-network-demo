import {WithId} from "mongodb";
import {UsersDbType, UsersOutputType} from "../usersTypes";

export const UsersMapper = (user: WithId<UsersDbType>): UsersOutputType => {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}