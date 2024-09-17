const { Modification } = require('../models/models')

class ModificationService{
    async createAll(modifications, productId){
        return await Promise.all(modifications.map(async mod => await Modification.create({name: mod.name, diesel: mod.diesel, note: mod.note, productId})))
    }

    async create(name, diesel, note, productId){
        return await Modification.create({name, diesel, note, productId})
    }

    async get(productId){
        const modifications = await Modification.findAll({where: {productId}})
        return modifications
    }

    async update(id, name, diesel, note){
        return await Modification.update({name, diesel, note}, {where: {id}})
    }

    async updateAll(productId, modifications){
        const oldModifications = await this.get(productId)
        const isPresent = {};
        await Promise.all(modifications.map(async item => {
            if(~item.id){
                isPresent[item.id] = true;
                const oldItem = oldModifications.find(oldItem => oldItem.id === item.id)
                if(item.name !== oldItem.name || item.diesel !== oldItem.diesel || item.note !== oldItem.note){
                    await this.update(item.id, item.name, item.diesel, item.note)
                } 
            }  
            else{
                await this.create(item.name, item.diesel, item.note, productId)
            }
        }))
        await Promise.all(oldModifications.map(async item => {
            if(!isPresent[item.id]) await this.delete(item.id)
        }))
    }

    async delete(id){
        return await Modification.destroy({where: {id}})
    }

    async deleteAll(productId){
        return await Modification.destroy({where: {productId}})
    }
}

module.exports = new ModificationService()