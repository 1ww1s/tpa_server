const {Item, TechCharacteristicItem} = require('../models/models')


class ItemService{
    async create(name, productId){
        return await Item.create({name, productId}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async get(productId){
        const items = await Item.findAll({where: {productId}}).catch(e => {throw DataBase.Conflict(e.message)})
        return items
    }

    async delete(id){
        await Item.destroy({where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async deleteAll(productId){
        await Item.destroy({where: {productId}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async update(id, name){
        return await Item.update({name}, {where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async updateAll(items, oldItems, productId){
        const isPresent = {};
        items = await Promise.all(items.map(async i => {
            if(~i.id){
                isPresent[i.id] = true;
                const oldI = oldItems.find(oldI => oldI.id === i.id)
                if(i.name !== oldI.name) await this.update(i.id, i.name)
                return i
            }
            else{
                return await this.create(i.name, productId)
            }
        }))
        await Promise.all(oldItems.map(async i => {
            if(!isPresent[i.id]) await this.delete(i.id)
        }))
        return items
    }
}


module.exports = new ItemService()