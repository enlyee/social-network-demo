import {WithId} from "mongodb";
import {AuthSessionsType} from "../authTypes";
import {SessionOutputType} from "../sessionType";

export const SessionMapper = (sessionDb: WithId<AuthSessionsType>): SessionOutputType => {
    return {
        ip: sessionDb.ip,
        title: sessionDb.title,
        lastActiveDate: sessionDb.lastActiveDate.toISOString(),
        deviceId: sessionDb.deviceId
    }
}