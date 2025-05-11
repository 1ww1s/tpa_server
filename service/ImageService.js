const path = require("path");
const { Image } = require("../models/models");
const deleteFileService = require("./DeleteFileService");
const DataBase = require("../error/DataBaseError");

class ImageService{

    async createAll(images, productId){
        await Promise.all(images.map(async (img, index) => await this.create(img.name, img.url, index, productId)))
    }

    async create(name, url, index, productId, productSectionId){
        await Image.create({name, url, productId, index, productSectionId}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async get(productId, productSectionId){
        let images;
        if(productId) images = await Image.findAll({where: {productId}, order: ['index']})
        else images = await Image.findOne({where: {productSectionId}}).catch(e => {throw DataBase.Conflict(e.message)})
        return images
    }

    async update(id, name, url, index){
        return await Image.update({name, url, index}, {where:{id}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async updateAll(productId, images, processedImages){
        const oldImages = await this.get(productId)
        const isPresent = {};
        let idProcessedImages = 0;
        await Promise.all(images.map(async (img, index) => {
            if(img.id){
                isPresent[img.id] = true;
                const oldImg = oldImages.find(oldImg => oldImg.id === img.id)
                await this.update(img.id, img.name, oldImg.url, index)
            }
            else{
                if(!processedImages[idProcessedImages]?.path){
                    throw RequestError.BadRequest(`Не найден файл ${img.name} при загрузке, попробуйте удалить его и заново добавить`)
                }
                await this.create(img.name, processedImages[idProcessedImages++].path, index, productId)
            }
        }))
        await Promise.all(oldImages.map(async i => {
            if(!isPresent[i.id]){
                await this.delete(i.id)
                const p = path.join(__dirname, '..', i.url)
                await deleteFileService.safeDeleteFile(p)
            }                
        }))
    }

    async delete(id){
        return await Image.destroy({where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async deleteAll(productId){
        const images = await this.get(productId)
        await Promise.all(images.map(async (image) => {
            await this.delete(image.id)
            const p = path.join(__dirname, '..', image.url)
            await deleteFileService.safeDeleteFile(p)
        }))
    }
}

module.exports = new ImageService()