const { Info } = require("../models/models");



class InfoService{

    async create(value, productId, productSectionId){
        return await Info.create({value, productId, productSectionId}).catch(e => {throw DataBase.Conflict(e.message)})
    }


    async get(productId, productSectionId){
        const info = await Info.findOne({where: {productId, productSectionId}}).catch(e => {throw DataBase.Conflict(e.message)})
        return info
    }

    async update(product, productSection){
        if(product){
            const oldInfo = await this.get(product.id, null)
            if(product.info !== oldInfo.value) await Info.update(
                {value: product.info}, {where: {productId: product.id}}).catch(e => {throw DataBase.Conflict(e.message)}
            ).catch(e => {throw DataBase.Conflict(e.message)})
        }
        else{
            const oldInfo = await this.get(null, productSection.id)
            if(productSection.info !== oldInfo.value) await Info.update(
                {value: productSection.info}, {where: {productSectionId: productSection.id}}
            ).catch(e => {throw DataBase.Conflict(e.message)})
        }        
    }

    async delete(productId){
        return await Info.destroy({where: {productId}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

}


module.exports = new InfoService()