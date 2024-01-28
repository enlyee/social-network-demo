import {tokensBlackListCollection} from "../db/runDb";

export const tokenRepository = {
    async addTokenToBlackList(token: string){
        await tokensBlackListCollection.insertOne({token: token})
    },
    async checkTokenInBlackList(token: string){
        const status = await tokensBlackListCollection.findOne({token: token})
        return !!status
    }
}