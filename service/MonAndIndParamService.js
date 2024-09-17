const DataBase = require('../error/DataBaseError')
const { MonAndIndParam } = require('../models/models')

class MonAndIndParamService {

    async create(monAndIndParams, productId){
        await MonAndIndParam.create({value: monAndIndParams, productId})
    }

    async get(productId){
        const monAndIndParams = await MonAndIndParam.findOne({where: {productId}})
        return monAndIndParams
    }

    async update(productId, value){
        return await MonAndIndParam.update({value, productId}, {where: {productId}})
    }

    async delete(productId){
        return await MonAndIndParam.destroy({where: {productId}})
    }

}


module.exports = new MonAndIndParamService()