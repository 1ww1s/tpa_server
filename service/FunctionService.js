const { Function } = require('../models/models')

class FunctionService{
    
    async create(functions, productId){
        await Function.create({value: functions, productId})
    }

    async get(productId){
        const functions = await Function.findOne({where: {productId}})
        return functions
    }

    async update(productId, value){
        return await Function.update({value}, {where: {productId}})
    }

    async delete(productId){
        return await Function.destroy({where: {productId}})
    }
}

module.exports = new FunctionService()