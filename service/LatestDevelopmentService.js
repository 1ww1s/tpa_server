const DataBase = require("../error/DataBaseError")
const { LatestDevelopment } = require("../models/models")
const ImageService = require("./ImageService")
const ProductSectionService = require("./ProductSectionService")
const ProductService = require("./ProductService")

class LatestDevelopmentService {

    async create(productId){
        const count = await LatestDevelopment.count().catch(e => {throw DataBase.Conflict(e.message)})
        if(count === 4) throw DataBase.Conflict('Достигнуто максимальное количество последних разработок, удалите одну из них и попробуйте снова')
        await LatestDevelopment.create({productId}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async delete(productId){
        await LatestDevelopment.destroy({where: {productId}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async get(){
        const latestDevelopmentsData = await LatestDevelopment.findAll()
        const latestDevelopments = await Promise.all(latestDevelopmentsData.map(async ld => {
            const product = await ProductService.get(ld.productId)
            const sectionSlug = await ProductSectionService.get(null, null, product.productSectionId)
            const img = (await ImageService.get(product.id))[0]
            return {name: product.name, slug: sectionSlug?.slug + '/' + product.slug, img: {name: img?.name, value: img?.value}}
        }))
        return latestDevelopments
    }

    async getItems(){
        const latestDevelopmentsData = await LatestDevelopment.findAll()
        const items = await Promise.all(latestDevelopmentsData.map(async ld => {
            const product = await ProductService.get(ld.productId)
            return {name: product.name, slug: product.slug}
        }))
        return items
    }
}

module.exports = new LatestDevelopmentService()