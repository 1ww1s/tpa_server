const path = require("path")
const { File } = require("../models/models")
const deleteFileService = require("./DeleteFileService")
const RequestError = require("../error/RequestError")

class FileService {

    async create(name, url, index, informationDisclosureId){
        return await File.create({name, url, index, informationDisclosureId}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async update(id, name, url, index){
        return await File.update({name, url, index}, {where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async delete(id){
        return await File.destroy({where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async getAll(informationDisclosureId){
        return await File.findAll({where: {informationDisclosureId}, order: ['index']}).catch(e => {throw DataBase.Conflict(e.message)})
    }
   
    async updateAll(informationDisclosureId, files, processedFiles){
        const oldFiles = await this.getAll(informationDisclosureId)
        const isPresent = {};
        let idProcessedFiles = 0;
        await Promise.all(files.map(async (file, index) => {
            if(file.id){
                isPresent[file.id] = true;
                const oldfile = oldFiles.find(oldFile => oldFile.id === file.id)
                if(oldfile && (index !== oldFiles.index || oldFiles.name !== file.name)){
                    await this.update(file.id, file.name, oldfile.url, index)
                }   
            }
            else{
                if(!processedFiles[idProcessedFiles]?.path){
                    throw RequestError.BadRequest(`Не найден файл ${file.name} при загрузке, попробуйте удалить его и заново добавить`)
                }
                await this.create(file.name, processedFiles[idProcessedFiles++].path, index, informationDisclosureId)
            }
        }))
        await Promise.all(oldFiles.map(async file => {
            if(!isPresent[file.id]) {
                await this.delete(file.id)
                const p = path.join(__dirname, '../..', file.url)
                await deleteFileService.safeDeleteFile(p)
            }
        }))
    }

}

module.exports = new FileService()