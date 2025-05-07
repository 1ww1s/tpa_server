const { DeliverySet } = require("../models/models")


class DeliverySetService{

    async createAll(deliverySet, productId){
        await Promise.all(deliverySet.map(async (row, ind) => await this.create(row.name, row.numb, row.note, ind, productId)))
    }

    async create(name, numb, note, index, productId){
        await DeliverySet.create({name, numb, note, index, productId}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async get(productId){
        return await DeliverySet.findAll({where: {productId}, order: ['index']}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async update(id, name, numb, note, index){
        return await DeliverySet.update({name, numb, note, index}, {where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async updateAll(productId, deliverySet){
        const oldDeliverySet = await this.get(productId)
        const isPresent = {};
        await Promise.all(deliverySet.map(async (item, index) => {
            if(~item.id){
                isPresent[item.id] = true;
                const oldItem = oldDeliverySet.find(oldItem => oldItem.id === item.id)
                if(index !== oldItem.index || item.name !== oldItem.name || item.numb !== oldItem.numb || item.note !== oldItem.note){
                    await this.update(item.id, item.name, item.numb, item.note, index)
                }   
            }
            else{
                await this.create(item.name, item.numb, item.note, index, productId)
            }
        }))
        await Promise.all(oldDeliverySet.map(async item => {
            if(!isPresent[item.id]) await this.delete(item.id)
        }))
    }

    async delete(id){
        return await DeliverySet.destroy({where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async deleteAll(productId){
        return await DeliverySet.destroy({where: {productId}}).catch(e => {throw DataBase.Conflict(e.message)})
    }
}

module.exports = new DeliverySetService()