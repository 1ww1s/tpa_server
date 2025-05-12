const DataBase = require("../error/DataBaseError")
const RequestError = require("../error/RequestError")
const { ModificationItem } = require("../models/models")


class ModificationItemService{

    async create(value, modificationId, itemId){
        return await ModificationItem.create({value, modificationId, itemId}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async update(id, value){
        return await ModificationItem.update({value}, {where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async updateAll(mod, oldMod, items){
        await Promise.all(mod.value.map(async (v, ind) => {
            if(~v.id){
                const oldV = oldMod.value.find(oldV => oldV.id === v.id)
                if(v.value !== oldV.value){
                    await this.update(v.id, v.value)
                }
            }
            else {
                if(!items[ind]) throw RequestError.BadRequest('Нет продукта для соответствующего значения характеристики')
                await this.create(v.value, mod.id, items[ind].id)
            }
        }))
    }

    async getAll(itemId) {
        return await ModificationItem.findAll({where: {itemId}})
    }

    async delete(id){
        return await ModificationItem.destroy({where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})    
    }

}

module.exports = new ModificationItemService()