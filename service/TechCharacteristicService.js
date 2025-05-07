const DataBase = require('../error/DataBaseError');
const RequestError = require('../error/RequestError');
const { TechCharacteristic, TechCharacteristicItem, Item } = require('../models/models')
const itemService = require('./ItemService');
const techCharacteristicItemService = require('./TechCharacteristicItemService');
const unitService = require('./UnitService')

class TechCharacteristicService {
    async createAll(techCharacteristics, productId){
        const itemNames = techCharacteristics.items;
        if(!itemNames.length) throw RequestError.BadRequest('Нет значений')
        const itemsData = await Promise.all(itemNames.map(async item => await itemService.create(item.name, productId)))
        await Promise.all(techCharacteristics.data.map(async (tc, ind) => {
            await this.create(tc.name, tc.unit, tc.value, itemsData, ind, productId)
        }))
    }

    async create(name, unit, values, itemsData, index, productId){
        const unitData = await unitService.getByVal(unit)
        if(!unitData) throw DataBase.NotFound('Данной единицы измерения не найдено')
        const tcData = await TechCharacteristic.create({name, index, productId, unitId: unitData.id}).catch(e => {throw DataBase.Conflict(e.message)})
        await Promise.all(values.map(async (val, ind) => {
            if(!itemsData[ind]) throw RequestError.BadRequest('Нет продукта для соответствующего значения характеристики')
            await TechCharacteristicItem.create({value: val.value, techCharacteristicId: tcData.id, itemId: itemsData[ind].id}).catch(e => {throw DataBase.Conflict(e.message)})
        }))
    }

    async update(id, name, index, unitId){
        return await TechCharacteristic.update({name, index, unitId}, {where:{id}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async updateAll(productId, techCharacteristics){
        const oldTechCharacteristics = await this.getAll(productId)
        const newItems = await itemService.updateAll(techCharacteristics.items, oldTechCharacteristics.items, productId)
        const isPresent = {};
        await Promise.all(techCharacteristics.data.map(async (tc, index) => {
            const unit = await unitService.getByVal(tc.unit)
            if(!unit) throw DataBase.NotFound('Данной единицы измерения не найдено')
            if(~tc.id){
                isPresent[tc.id] = true;
                const oldTc = oldTechCharacteristics.data.find(oldTc => oldTc.id === tc.id)
                if(index !== oldTc.index || tc.name !== oldTc.name || tc.unit !== oldTc.unit){
                    await this.update(tc.id, tc.name, index, unit.id)
                }
                await techCharacteristicItemService.updateAll(tc, oldTc, newItems)
            }
            else{
                await this.create(tc.name, unit.value, tc.value, newItems, index, productId)
            }

        }))
        await Promise.all(oldTechCharacteristics.data.map(async tc => {
            if(!isPresent[tc.id]) await this.delete(tc.id)
        }))
    }

    async getAll(productId){
        const itemsData = await Item.findAll({where: {productId}, include: TechCharacteristic}).catch(e => {throw DataBase.Conflict(e.message)})
        const techCharacteristicData = await TechCharacteristic.findAll({where: {productId}, order: ['index'], include: Item}).catch(e => {throw DataBase.Conflict(e.message)})
        const techCharacteristics = await Promise.all(techCharacteristicData.map(async tc =>  {
            const unit = (await unitService.getById(tc.unitId)).value
            const value = tc.items.map(i => {return {id: i.techCharacteristic_item.id, value: i.techCharacteristic_item.value}})
            return {
                id: tc.id,
                index: tc.index,
                name: tc.name,
                unit: unit,
                value
            }
        }))
        return{
            items: itemsData.map(i => { return { id: i.id, name: i.name }}),
            data: techCharacteristics
        }
    }

    async delete(id){
        await TechCharacteristic.destroy({where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async deleteAll(productId){
        await TechCharacteristic.destroy({where: {productId}}).catch(e => {throw DataBase.Conflict(e.message)})
    }
}

module.exports = new TechCharacteristicService()