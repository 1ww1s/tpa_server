const path = require("path")
const DataBase = require("../error/DataBaseError")
const fileProcessing = require("../middleware/FileProcessing")
const { LatestDevelopment } = require("../models/models")
const deleteFileService = require("./DeleteFileService")

class LatestDevelopmentService {

    async create(title, link, file){
        const count = await LatestDevelopment.count().catch(e => {throw DataBase.Conflict(e.message)})
        // if(count === 4) throw DataBase.Conflict('Достигнуто максимальное количество последних разработок, удалите одну из них и попробуйте снова')
        const processedImage = await fileProcessing.image('development', file)
        await LatestDevelopment.create(
            {title, link, imageUrl: processedImage.path, index: count}
        ).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async delete(id){
        const latestDevelopment = await this.getById(id)
        if(!latestDevelopment) throw DataBase.NotFound(`Последняя разработка с id=${id} не найдена`)
        await LatestDevelopment.destroy({where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})
        const p = path.join(__dirname, '../..', latestDevelopment.imageUrl)
        await deleteFileService.safeDeleteFile(p)
    }

    async getById(id){
        return await LatestDevelopment.findOne({where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async getAll(){
        const latestDevelopmentsData = await LatestDevelopment.findAll()
        const latestDevelopments = await Promise.all(latestDevelopmentsData.map(async ld => {
            return {title: ld.title, link: ld.link, img: {url: ld.imageUrl}}
        }))
        return latestDevelopments
    }

    async get(title){
        const data = await LatestDevelopment.findOne({where: {title}})
        return {id: data.id, title: data.title, link: data.link, img: {url: data.imageUrl}}
    }


    async getItems(){
        const latestDevelopmentsData = await LatestDevelopment.findAll()
        const items = await Promise.all(latestDevelopmentsData.map(async ld => {
            return {title: ld.title}
        }))
        return items
    }
}

module.exports = new LatestDevelopmentService()