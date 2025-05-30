const { RefreshToken } = require("../models/models")
const jwt = require('jsonwebtoken')

class TokenService{

    async generateTokens(payloadForAccess, payloadForRefresh){
        const accessToken = jwt.sign(payloadForAccess, process.env.JWT_ACCESS_SECRET, {expiresIn: '15m'})
        const refreshToken = jwt.sign(payloadForRefresh, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
        return {
            accessToken,
            refreshToken
        }
    }

    async saveRefreshToken(token, userId){
        const tokenData = await RefreshToken.findOne({where: {userId}}).catch(e => {throw DataBase.Conflict(e.message)})
        if(tokenData){
            tokenData.token = token;
            return await tokenData.save()
        }
        const newToken = await RefreshToken.create({token, userId}).catch(e => {throw DataBase.Conflict(e.message)})
        return newToken
    }
    
    async validateRefreshToken(token){
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return userData
        }
        catch(e){
            return null
        }
    }

    async validateAccessToken(token){
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            return userData
        }
        catch(e){
            return null
        }
    }

    async getUser(token){
        const user = await RefreshToken.findOne({where: {token}}).catch(e => {throw DataBase.Conflict(e.message)})
        return user
    }

    async removeToken(token){
        await RefreshToken.destroy({where: {token}}).catch(e => {throw DataBase.Conflict(e.message)})
    }
}

module.exports = new TokenService()