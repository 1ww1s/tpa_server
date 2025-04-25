const { File } = require("../models/models")

class FileService {

    async create(name, value, informationDisclosureId){
        return await File.create({name, value, informationDisclosureId}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async update(name, value, informationDisclosureId){
        return await File.update({name, value}, {where: {informationDisclosureId}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async delete(id){
        return await File.destroy({where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async getAll(informationDisclosureId){
        return await File.findAll({where: {informationDisclosureId}}).catch(e => {throw DataBase.Conflict(e.message)})
    }
   
    async updateAll(informationDisclosureId, files){
        const oldFiles = await this.getAll(informationDisclosureId)
        const isPresent = {};
        await Promise.all(files.map(async file => {
            if(file.id){
                isPresent[file.id] = true;
                const oldfile = oldFiles.find(oldFile => oldFile.id === file.id)
                if(oldfile && (oldFiles.name !== file.name || oldFiles.value !== file.value)){
                    await this.update(file.name, file.value, file.id)
                }   
            }
            else{
                await this.create(file.name, file.value, informationDisclosureId)
            }
        }))
        await Promise.all(oldFiles.map(async file => {
            if(!isPresent[file.id]) await this.delete(file.id)
        }))
    }

}

module.exports = new FileService()