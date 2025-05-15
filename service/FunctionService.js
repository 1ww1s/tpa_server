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

    async isEmpty(productId){
        let isEmpty = true;
        const count = await Function.count({where: {productId}}).catch(e => {throw DataBase.Conflict(e.message)})
        if(count){
            isEmpty = false;
        }
        return isEmpty
    }
}

module.exports = new FunctionService()