const { Info } = require("../models/models");



class InfoService{

    async create(value, productId, productSectionId){
        return await Info.create({value, productId, productSectionId})
    }


    async get(productId, productSectionId){
        const info = await Info.findOne({where: {productId, productSectionId}})
        return info
    }

    async update(product, productSection){
        if(product){
            const oldInfo = await this.get(product.id, null)
            if(product.info !== oldInfo.value) await Info.update({value: product.info}, {where: {productId: product.id}})
        }
        else{
            const oldInfo = await this.get(null, productSection.id)
            if(productSection.info !== oldInfo.value) await Info.update({value: productSection.info}, {where: {productSectionId: productSection.id}})
        }        
    }

    async delete(productId){
        return await Info.destroy({where: {productId}})
    }

}


module.exports = new InfoService()