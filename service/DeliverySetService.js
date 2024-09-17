const { DeliverySet, Info } = require("../models/models")


class DeliverySetService{

    async createAll(deliverySet, productId){
        await Promise.all(deliverySet.map(async row => await DeliverySet.create({name: row.name, numb: row.numb, note: row.note, productId})))
    }

    async create(name, numb, note, productId){
        await DeliverySet.create({name, numb, note, productId})
    }

    async get(productId){
        const deliverySet = await DeliverySet.findAll({where: {productId}})
        return deliverySet
    }

    async update(id, name, numb, note){
        return await DeliverySet.update({name, numb, note}, {where: {id}})
    }

    async updateAll(productId, deliverySet){
        const oldDeliverySet = await this.get(productId)
        const isPresent = {};
        await Promise.all(deliverySet.map(async item => {
            if(~item.id){
                isPresent[item.id] = true;
                const oldItem = oldDeliverySet.find(oldItem => oldItem.id === item.id)
                if(item.name !== oldItem.name || item.numb !== oldItem.numb || item.note === oldItem.note){
                    await this.update(item.id, item.name, item.numb, item.note)
                }   
            }
            else{
                await this.create(item.name, item.numb, item.note, productId)
            }
        }))
        await Promise.all(oldDeliverySet.map(async item => {
            if(!isPresent[item.id]) await this.delete(item.id)
        }))
    }

    async delete(id){
        return await DeliverySet.destroy({where: {id}})
    }

    async deleteAll(productId){
        return await DeliverySet.destroy({where: {productId}})
    }
}

module.exports = new DeliverySetService()