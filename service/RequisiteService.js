const DataBase = require("../error/DataBaseError")
const { Requisite } = require("../models/models")



class RequisiteService{

    async create(name, value){
        const requisiteData = await Requisite.create({name, value})
        .catch(e => {throw DataBase.UnprocessableEntity('Название реквизита должно быть уникальным')})
        return requisiteData
    }

    async update(id, name, value){
        return await Requisite.update({name, value}, {where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async delete(id){
        return await Requisite.destroy({where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async getAll(){
        const requisites = await Requisite.findAll()
        return requisites.map(requisite => {return {id: requisite.id, name: requisite.name, value: requisite.value}})
    }

}


module.exports = new RequisiteService()