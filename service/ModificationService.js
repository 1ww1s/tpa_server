const DataBase = require('../error/DataBaseError');
const RequestError = require('../error/RequestError');
const { Modification, ModificationItem, Item } = require('../models/models');
const itemService = require('./ItemService');
const modificationItemService = require('./ModificationItemService');

class ModificationService{
    async createAll(modifications, productId){
        const itemNames = modifications.items;
        if(!itemNames.length) throw RequestError.BadRequest('Нет значений')
        const itemsData = await Promise.all(itemNames.map(async item => await itemService.create(item.name, productId)))
        await Promise.all(modifications.data.map(async (tc, ind) => {
            await this.create(tc.name, tc.value, itemsData, ind, productId)
        }))
    }

    async create(name, values, itemsData, index, productId){
        const mod = await Modification.create({name, index, productId}).catch(e => {throw DataBase.Conflict(e.message)})
        await Promise.all(values.map(async (val, ind) => {
            if(!itemsData[ind]) throw RequestError.BadRequest('Нет продукта для соответствующего значения характеристики')
            await ModificationItem.create({value: val.value, modificationId: mod.id, itemId: itemsData[ind].id}).catch(e => {throw DataBase.Conflict(e.message)})
        }))
    }

    async get(productId){
        return await Modification.findAll({where: {productId}, order: ['index']}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async update(id, name, index){
        return await Modification.update({name, index}, {where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async updateAll(productId, modifications){
        const oldModifications = await this.getAll(productId)
        const newItems = await itemService.updateAll(modifications.items, oldModifications.items, productId)
        const isPresent = {};
        await Promise.all(modifications.data.map(async (mod, index) => {
            if(~mod.id){
                isPresent[mod.id] = true;
                const oldMod = oldModifications.data.find(oldMod => oldMod.id === mod.id)
                if(index !== oldMod.index || mod.name !== oldMod.name || mod.unit !== oldMod.unit){
                    await this.update(mod.id, mod.name, index)
                }
                await modificationItemService.updateAll(mod, oldMod, newItems)
            }
            else{
                await this.create(mod.name, mod.value, newItems, index, productId)
            }

        }))
        await Promise.all(oldModifications.data.map(async mod => {
            if(!isPresent[mod.id]) await this.delete(mod.id)
        }))
    }

    async getAll(productId){
        const itemsData = await Item.findAll({
            where: {productId}, 
            include: {
                model: Modification,
                required: true,
                attributes: []
            }
        }).catch(e => {throw DataBase.Conflict(e.message)})
        const modifData = await Modification.findAll(
            {
                where: {productId}, 
                order: ['index'], 
                include: [
                    {
                        model: Item,
                    }
                ]
            }
        ).catch(e => {throw DataBase.Conflict(e.message)})
        const modifs = await Promise.all(modifData.map(async (modif, ind) =>  {
            const value = (modif.items.map(i => (
                {name: i.name, id: i.modification_item.id, value: i.modification_item.value}))
            ).sort((a, b) => a.id - b.id)
            
            return {
                id: modif.id,
                index: modif.index,
                name: modif.name,
                value: value.map(v => ({id: v.id, value: v.value}))
            }
        }))
        return{
            items: itemsData.map(i => { return { id: i.id, name: i.name }}),
            data: modifs
        }
    }

    async delete(id){
        return await Modification.destroy({where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async deleteAll(productId){
        return await Modification.destroy({where: {productId}}).catch(e => {throw DataBase.Conflict(e.message)})
    }
}

module.exports = new ModificationService()