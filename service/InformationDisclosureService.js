const { Op } = require("sequelize");
const DataBase = require("../error/DataBaseError");
const { InformationDisclosure, File } = require("../models/models");

const fileService = require('./FileService')

class InformationDisclosureService {InformationDisclosure

    async createAll(name, files){
        const informationDisclosure = await this.create(name)
        await Promise.all(files.map(async file => {
            await fileService.create(file.name, file.value, informationDisclosure.id)
        }))
    }
    
    async updateAll(id, name, files){
        await this.update({name}, {id})
        const oldInformationDisclosure = await this.get(id)
        if(oldInformationDisclosure.name !== name){
            await this.update(oldInformationDisclosure.id, name)
        }
        await fileService.updateAll(oldInformationDisclosure.id, files)
    }

    async getWithFiles(name){
        const informationDisclosureData = await this.getByName(name)
        if(!informationDisclosureData) throw DataBase.NotFound(`Раздела с id=${id} не найдено`)
        const filesData = await fileService.getAll(informationDisclosureData.id)
        return {
            id: informationDisclosureData.id,
            name: informationDisclosureData.name,
            files: filesData.map(file => ({id: file.id, name: file.name, value: file.value}))
        }
    }

    async getAll(){
        const informationDisclosureDatas = await InformationDisclosure.findAll()
        const res = await Promise.all(informationDisclosureDatas.map(async informationDisclosureData => {
            return await this.getWithFiles(informationDisclosureData.name)
        }))
        return res
    }

    async getByName(name){
        return await InformationDisclosure.findOne({where: {name}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async get(id){
        return await InformationDisclosure.findOne({where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async create(name){
        return await InformationDisclosure.create({name}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async update(id, name){
        return await InformationDisclosure.update({name}, {where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async delete(id){
        return await InformationDisclosure.destroy({where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    
    async startsWith(name){
        return await InformationDisclosure.findAll({ where:{name: {[Op.startsWith]: name}}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

}

module.exports = new InformationDisclosureService()