const path = require("path")
const { Size } = require("../models/models")
const deleteFileService = require("./DeleteFileService")


class SizeService{

    async create(url, productId){
        return await Size.create({url, productId}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async update(id, url){
        return await Size.update({url}, {where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async delete(id){
        return await Size.destroy({where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async get(productId){
        return await Size.findOne({where: {productId}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async deleteFile(productId){
        const image = await this.get(productId)
        const p = path.join(__dirname, '..', image.url)
        await deleteFileService.safeDeleteFile(p)
    }
}


module.exports = new SizeService()