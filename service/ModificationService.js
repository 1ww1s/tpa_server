const { Modification } = require('../models/models')

class ModificationService{
    async createAll(modifications, productId){
        return await Promise.all(modifications.map(async (mod, ind) => await this.create(mod.name, mod.diesel, mod.note, ind, productId)))
    }

    async create(name, diesel, note, index, productId){
        return await Modification.create({name, diesel, note, index, productId}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async get(productId){
        return await Modification.findAll({where: {productId}, order: ['index']}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async update(id, name, diesel, note, index){
        return await Modification.update({name, diesel, note, index}, {where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async updateAll(productId, modifications){
        const oldModifications = await this.get(productId)
        const isPresent = {};
        await Promise.all(modifications.map(async (item, index) => {
            if(~item.id){
                isPresent[item.id] = true;
                const oldItem = oldModifications.find(oldItem => oldItem.id === item.id)
                if(index != oldItem.index || item.name !== oldItem.name || item.diesel !== oldItem.diesel || item.note !== oldItem.note){
                    await this.update(item.id, item.name, item.diesel, item.note, index)
                } 
            }  
            else{
                await this.create(item.name, item.diesel, item.note, index, productId)
            }
        }))
        await Promise.all(oldModifications.map(async item => {
            if(!isPresent[item.id]) await this.delete(item.id)
        }))
    }

    async delete(id){
        return await Modification.destroy({where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async deleteAll(productId){
        return await Modification.destroy({where: {productId}}).catch(e => {throw DataBase.Conflict(e.message)})
    }
}

module.exports = new ModificationService()