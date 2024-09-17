const DataBase = require('../error/DataBaseError');
const RequestError = require('../error/RequestError');
const { TechCharacteristic, TechCharacteristicItem, Item } = require('../models/models')
const itemService = require('./ItemService');
const techCharacteristicItemService = require('./TechCharacteristicItemService');
const unitService = require('./UnitService')

class TechCharacteristicService {
    async createAll(techCharacteristics, productId){
        console.log(techCharacteristics)
        const itemNames = techCharacteristics.items;
        if(!itemNames.length) throw RequestError.BadRequest('Нет значений')
        const itemsData = await Promise.all(itemNames.map(async item => await itemService.create(item.name, productId)))
        await Promise.all(techCharacteristics.data.map(async tc => {
            await this.create(tc.name, tc.unit, tc.value, itemsData, productId)
        }))
    }

    async create(name, unit, values, itemsData, productId){
        const unitData = await unitService.getByVal(unit)
        if(!unitData) throw DataBase.NotFound('Данной единицы измерения не найдено')
        const tcData = await TechCharacteristic.create({name, productId, unitId: unitData.id})
        await Promise.all(values.map(async (val, ind) => {
            if(!itemsData[ind]) throw RequestError.BadRequest('Нет продукта для соответствующего значения характеристики')
            await TechCharacteristicItem.create({value: val.value, techCharacteristicId: tcData.id, itemId: itemsData[ind].id})
        }))
    }

    async update(id, name, unitId){
        return await TechCharacteristic.update({name, unitId}, {where:{id}})
    }

    async updateAll(productId, techCharacteristics){
        const oldTechCharacteristics = await this.getAll(productId)
        const newItems = await itemService.updateAll(techCharacteristics.items, oldTechCharacteristics.items, productId)
        const isPresent = {};
        await Promise.all(techCharacteristics.data.map(async (tc, ind) => {
            const unit = await unitService.getByVal(tc.unit)
            if(!unit) throw DataBase.NotFound('Данной единицы измерения не найдено')
            if(~tc.id){
                isPresent[tc.id] = true;
                const oldTc = oldTechCharacteristics.data.find(oldTc => oldTc.id === tc.id)
                if(tc.name !== oldTc.name || tc.unit !== oldTc.unit){
                    await this.update(tc.id, tc.name, unit.id)
                }
                techCharacteristicItemService.updateAll(tc, oldTc, newItems)
            }
            else{
                this.create(tc.name, unit.value, tc.value, newItems, productId)
            }

        }))
        await Promise.all(oldTechCharacteristics.data.map(async tc => {
            if(!isPresent[tc.id]) await this.delete(tc.id)
        }))
    }

    async getAll(productId){
        const itemsData = await Item.findAll({where: {productId}, include: TechCharacteristic})
        const techCharacteristicData = await TechCharacteristic.findAll({where: {productId}, include: Item})
        const techCharacteristics = await Promise.all(techCharacteristicData.map(async tc =>  {
            const unit = (await unitService.getById(tc.unitId)).value
            const value = tc.items.map(i => {return {id: i.techCharacteristic_item.id, value: i.techCharacteristic_item.value}})
            return {
                id: tc.id,
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
        await TechCharacteristic.destroy({where: {id}})
    }

    async deleteAll(productId){
        await TechCharacteristic.destroy({where: {productId}})
    }
}

module.exports = new TechCharacteristicService()