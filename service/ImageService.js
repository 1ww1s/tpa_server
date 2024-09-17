const { Image } = require("../models/models")



class ImageService{

    async createAll(images, productId){
        await Promise.all(images.map(async (img, index) => await Image.create({name: img.name, value: img.value, index, productId})))
    }

    async create(name, value, index, productId, productSectionId){
        await Image.create({name, value, productId, index, productSectionId})
    }

    async get(productId, productSectionId){
        let images;
        if(productId) images = await Image.findAll({where: {productId}, order: ['index']})
        else images = await Image.findOne({where: {productSectionId}})
        return images
    }

    async update(id, name, value, index){
        return await Image.update({name, value, index}, {where:{id}})
    }

    async updateAll(productId, images){
        const oldImages = await this.get(productId)
        const isPresent = {};
        await Promise.all(images.map(async (img, index) => {
            if(img.id){
                isPresent[img.id] = true;
                const oldImg = oldImages.find(oldImg => oldImg.id === img.id)
                if(img.name !== oldImg.name || img.value !== oldImg.value || index != oldImg.index){
                    await this.update(img.id, img.name, img.value, index)
                }   
            }
            else{
                await this.create(img.name, img.value, index, productId)
            }
        }))
        await Promise.all(oldImages.map(async i => {
            if(!isPresent[i.id]) await this.delete(i.id)
        }))
    }

    async delete(id){
        return await Image.destroy({where: {id}})
    }

    async deleteAll(productId){
        return await Image.destroy({where: {productId}})
    }
}

module.exports = new ImageService()