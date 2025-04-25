const { Modification } = require('../models/models')

class ModificationService{
    async createAll(modifications, productId){
        return await Promise.all(modifications.map(async mod => await this.create(mod.name, mod.diesel, mod.note, productId)))
    }

    async create(name, diesel, note, productId){
        return await Modification.create({name, diesel, note, productId}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async get(productId){
        return await Modification.findAll({where: {productId}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async update(id, name, diesel, note){
        return await Modification.update({name, diesel, note}, {where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})
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
        return await Modification.destroy({where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async deleteAll(productId){
        return await Modification.destroy({where: {productId}}).catch(e => {throw DataBase.Conflict(e.message)})
    }
}

module.exports = new ModificationService()