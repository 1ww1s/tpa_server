const { Op } = require("sequelize");
const DataBase = require("../error/DataBaseError");
const { InformationDisclosure, File } = require("../models/models");

const fileService = require('./FileService');
const fileProcessing = require("../middleware/FileProcessing");

class InformationDisclosureService {InformationDisclosure

    async createAll(name, filesNames, files){
        const informationDisclosure = await this.create(name)
        const processedFiles = await fileProcessing.files('pdf', files)
        await Promise.all(processedFiles.map(async (file, ind) => {
            await fileService.create(filesNames[ind].name, file.path, ind, informationDisclosure.id)
        }))
    }
    
    async updateAll(id, name, filesNames, processedFiles){
        await this.update(id, name)
        const oldInformationDisclosure = await this.get(id)
        if(oldInformationDisclosure.name !== name){
            await this.update(oldInformationDisclosure.id, name)
        }
        await fileService.updateAll(oldInformationDisclosure.id, filesNames, processedFiles)
    }

    async getWithFiles(name){
        const informationDisclosureData = await this.getByName(name)
        if(!informationDisclosureData) throw DataBase.NotFound(`Раздела с id=${id} не найдено`)
        const filesData = await fileService.getAll(informationDisclosureData.id)
        return {
            id: informationDisclosureData.id,
            name: informationDisclosureData.name,
            files: filesData.map(file => ({id: file.id, name: file.name, url: file.url}))
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