const DataBase = require('../error/DataBaseError')
const { Function } = require('../models/models')

class FunctionService{
    
    async create(functions, productId){
        await Function.create({value: functions, productId}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async get(productId){
        return await Function.findOne({where: {productId}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async update(productId, value){
        return await Function.update({value}, {where: {productId}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async delete(productId){
        return await Function.destroy({where: {productId}}).catch(e => {throw DataBase.Conflict(e.message)})
    }
}

module.exports = new FunctionService()