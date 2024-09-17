const { Role } = require("../models/models");
const DataBase = require('../error/DataBaseError')


class RoleService{
    async create(value){
        await Role.create({value})
        .catch(e => {throw DataBase.UnprocessableEntity('Название роли должно быть уникальным')})
    }

    async get(value){
        const role = await Role.findOne({where: {value}})
        return role
    }
    
    async getAll() {
        const roles = await Role.findAll()
        return roles;
    }

}

module.exports = new RoleService()