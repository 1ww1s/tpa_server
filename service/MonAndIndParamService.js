const DataBase = require('../error/DataBaseError')
const { MonAndIndParam } = require('../models/models')

class MonAndIndParamService {

    async create(monAndIndParams, productId){
        await MonAndIndParam.create({value: monAndIndParams, productId}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async get(productId){
        return await MonAndIndParam.findOne({where: {productId}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async update(productId, value){
        return await MonAndIndParam.update({value, productId}, {where: {productId}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async delete(productId){
        return await MonAndIndParam.destroy({where: {productId}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

}


module.exports = new MonAndIndParamService()