const { where, Op } = require('sequelize')
const DataBase = require('../error/DataBaseError')
const {Unit} = require('../models/models')
const slug = require('slug')

class UnitService{
    async create(value){
        await Unit.create({value})
        .catch(e => {throw DataBase.UnprocessableEntity('Значение должно быть уникальным')})
    }

    async update(id, value){
        await Unit.update({value}, {where: {id}})
    }

    async getById(id){
        const unit = await Unit.findOne({where:{id}})
        return unit
    }

    async getByVal(value){
        const unit = await Unit.findOne({where:{value}})
        return unit
    }

    async getAll(){
        const unit = await Unit.findAll()
        return unit.map(u => { return {id: u.id, value: u.value}})
    }

    async getArrayByVal(value){
        const units = await Unit.findAll({ where:{value: {[Op.startsWith]: value}}})
        return units.map(u => {return {id: u.id, value: u.value}})
    }
}

module.exports = new UnitService() 