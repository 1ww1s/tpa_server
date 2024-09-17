const { User, UserRole, Role } = require('../models/models')
const AuthError = require('../error/AuthError')
const DataBaseError = require('../error/DataBaseError')
const UserDto = require('../dtos/userDto')
const TokenDto = require('../dtos/tokenDto')
const tokenService = require('./TokenService')


const bcrypr = require('bcrypt')

const roleService = require('./RoleService')


class UserService{
    async createRes(user){
        const userDto = new UserDto(user)
        const tokenDto = new TokenDto(user)
        const tokens = await tokenService.generateTokens({...tokenDto}, {...tokenDto})
        await tokenService.saveRefreshToken(tokens.refreshToken, user.id)
        return {user: userDto, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken}
    }

    async registration(email, password){
        const candidate = await User.findOne({where:{email}})
        if(candidate) throw AuthError.Conflict('Пользователь уже зарегистрирован')
        const userRole = await roleService.get('user')
        if(!userRole) throw DataBaseError.NotFound("Роль 'user' не найдена")
        const hashPassword = bcrypr.hashSync(password, 5)
        const user = await User.create({email, password: hashPassword, roleId: userRole.value})
        await UserRole.create({userId: user.id, roleId: userRole.id})
        user.roles = [userRole.value];
        return this.createRes(user)
    }

    async login(email, password){
        const user = await User.findOne({where: {email}, include: Role})
        if(!user) throw DataBaseError.NotFound('Пользователь не зарегистрирован')
        const isPassEquals = bcrypr.compareSync(password, user.password)
        if(!isPassEquals) throw AuthError.UnprocessableEntity('Неверный пароль')
        return this.createRes(user)
    }

    async logout(refreshToken){
        if(!refreshToken) return
        await tokenService.removeToken(refreshToken)
    }

    async refresh(refreshToken){
        const userData = await tokenService.validateRefreshToken(refreshToken)
        if(!userData) throw AuthError.UnauthorizedError()
        const refreshData = await tokenService.getUser(refreshToken)
        if(!refreshData) throw AuthError.UnauthorizedError()
        const userId = refreshData.userId;
        const user = await User.findOne({where: {id: userId}, include: Role})
        if(!user) throw AuthError.UnauthorizedError()
        return this.createRes(user)
    }

    async get(email){
        const userData = await User.findOne({where: {email}, include: Role})
        return userData
    }

    async checkAuth(email){
        const userData = await this.get(email)
        if(!userData) throw DataBaseError.NotFound('Пользователь не найден')
        const user = new UserDto(userData)
        return user
    }

    async addRole(userId, roleId){
        if(await UserRole.findOne({where: {userId, roleId}})) throw DataBaseError.NotFound('У пользователя уже есть такая роль')
        await UserRole.create({userId, roleId})
    }

    async deleteRole(userId, roleId){
        await UserRole.destroy({where: {userId, roleId}})
    }

    async getAll(){
        return await User.findAll({include: Role})
    }
    // async addUser(email){
    //     const candidate = await User.findOne({where:{email}})
    //     if(candidate) throw AuthError.Conflict('Пользователь уже зарегистрирован')
    // }
}

module.exports = new UserService()