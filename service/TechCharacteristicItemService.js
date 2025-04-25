const RequestError = require("../error/RequestError")
const { TechCharacteristicItem } = require("../models/models")


class TechCharacteristicItemService{

    async create(value, techCharacteristicId, itemId){
        return await TechCharacteristicItem.create({value, techCharacteristicId, itemId}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async createAll(tc, newTc, items){
        await Promise.all(tc.value.map(async (v, ind) => {
            if(!items[ind]) throw RequestError.BadRequest('Нет продукта для соответствующего значения характеристики')
            await this.create(v.value, newTc.id, items[ind].id)
        }))
    }

    async update(id, value){
        return await TechCharacteristicItem.update({value}, {where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async updateAll(tc, oldTc, items){
        await Promise.all(tc.value.map(async (v, ind) => {
            if(~v.id){
                const oldV = oldTc.value.find(oldV => oldV.id === v.id)
                if(v.value !== oldV.value){
                    this.update(v.id, v.value)
                }
            }
            else {
                if(!items[ind]) throw RequestError.BadRequest('Нет продукта для соответствующего значения характеристики')
                await this.create(v.value, tc.id, items[ind].id)
            }
        }))
    }

    async delete(id){
        return await TechCharacteristicItem.destroy({where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})    
    }

}

module.exports = new TechCharacteristicItemService()