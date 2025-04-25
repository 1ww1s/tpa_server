const slug = require('slug')
const { Product, Info } = require('../models/models')
const DataBase = require('../error/DataBaseError')
const deliverySetService = require('./DeliverySetService')
const functionService = require('./FunctionService')
const modificationService = require('./ModificationService')
const monAndIndParamService = require('./MonAndIndParamService')
const techCharacteristicService = require('./TechCharacteristicService')
const imageService = require('./ImageService')
const infoService = require('./InfoService')
const productSectionService = require('./ProductSectionService')
const { Op } = require('sequelize')


class ProductService {

    async create(productSectionId, productData){
        const nameSlug = slug(productData.name)
        const index = await Product.max('index', {where: productSectionId})
        const product = await Product.create({name: productData.name, slug: nameSlug, index: index + 1, productSectionId})
        .catch(e => {throw DataBase.UnprocessableEntity('Название продукта должно быть уникальным')})

        await infoService.create(productData.info, product.id, null)
        await functionService.create(productData.functions, product.id)
        await deliverySetService.createAll(productData.deliverySet, product.id)
        await modificationService.createAll(productData.modifications, product.id)
        await monAndIndParamService.create(productData.monAndIndParams, product.id)
        await techCharacteristicService.createAll(productData.techCharacteristics, product.id)
        await imageService.createAll(productData.images, product.id)
    }

    async getAll(slug){
        const productData = await Product.findOne({where: {slug}})
        if(!productData) throw DataBase.NotFound('Продукт не найден')
        const productSection = await productSectionService.get(null, null, productData.productSectionId)
        const info = (await infoService.get(productData.id, null)).value;
        const functions = (await functionService.get(productData.id)).value;
        const monAndIndParams = (await monAndIndParamService.get(productData.id)).value;
        const deliverySet = (await deliverySetService.get(productData.id)).map(ds => { return {id: ds.id, name: ds.name, numb: ds.numb, note: ds.note} })
        const modifications = (await modificationService.get(productData.id)).map(m => { return {id: m.id, name: m.name, diesel: m.diesel, note: m.note} })
        const techCharacteristics = await techCharacteristicService.getAll(productData.id)

        return {
            id: productData.id,
            name: productData.name,
            groupName: productSection?.title,
            info,
            functions,
            monAndIndParams,
            deliverySet,
            modifications,
            techCharacteristics
        }
    }

    async getImages(slug){
        const productData = await this.get(null, slug)
        if(!productData) throw DataBase.NotFound('Данный продукт не найден')
        const images = (await imageService.get(productData.id)).map(img => { return {id: img.id, name: img.name, value: img.value} })
        return images
    }

    async getPreviews(slug){
        const productSection = await productSectionService.get(null, slug)
        if(!productSection) throw DataBase.NotFound('Данный раздел продукции не найден')
        const productGroup = await Product.findAll({where: {productSectionId: productSection.id}, order: ['index']})
        const productPreviews = await Promise.all(productGroup.map(async p => {
            const info = await infoService.get(p.id, null)
            const img = (await imageService.get(p.id, null))[0]
            return {id: p.id, title: p.name, slug: slug + '/' + p.slug, info: info.value, img: {name: img?.name, value: img?.value}}
        }))
        return productPreviews
    }   
    
    async getPreview(slug){
        const product = await Product.findOne({where: {slug}})
        const info = await infoService.get(product.id, null)
        const img = (await imageService.get(product.id, null))[0]
        const productPreview = {id: product.id, title: product.name, slug: product.slug, info: info.value, img: {name: img?.name, value: img?.value}}
        return productPreview
    }  

    async update(product){
        const oldProduct = await this.get(product.id)
        if(!oldProduct) throw DataBase.NotFound('Данный продукт не найден')
        const productSection = await productSectionService.get(product.groupName)
        const nameSlug = slug(product.name)
        await Product.update({name: product.name, slug: nameSlug, productSectionId: productSection.id}, {where: {id: product.id}})
    }
    
    async get(id, slug){
        let product;
        if(id){
            product = await Product.findOne({where: {id}})
        }
        else{
            product = await Product.findOne({where: {slug}})
        }
        if(!product) throw DataBase.NotFound('Данный продукт не найден')
        return product
    }

    async getNameBySlug(slug){
        const productData = await Product.findOne({ where:{slug}})
        if(!productData) throw DataBase.NotFound('Данный продукт не найден')
        return {name: productData.name, slug}
    }

    async getItems(){
        const productSection = await productSectionService.getAll(false)
        const productItems = []
        await Promise.all(productSection.map(async ps => {
            console.log(ps.idy)
            const productData = await Product.findAll({where: {productSectionId: ps.id}})
            productData.forEach(p => productItems.push({productGroupSlug: ps.slug, productSlug: p.slug}))
        }))
        return productItems
    }

    async getItemsOfGroup(slug){
        const productData = await Product.findOne({where: {slug}})
        if(!productData) throw DataBase.NotFound('Данный продукт не найден')
        const productSectionId = productData.productSectionId;
        const productsOfGroup = await Product.findAll({where: {productSectionId}, order: ['index']})
        const itemsOfGroup = productsOfGroup.filter(pg => pg.id !== productData.id).map(pg => {return {name: pg.name, slug: pg.slug}})
        return itemsOfGroup
    }

    async getItemsByGroup(sectionSlug){
        const productSection = await productSectionService.get(null, sectionSlug)
        const productsOfGroup = await Product.findAll({where: {productSectionId: productSection.id}, order: ['index']})
        const itemsOfGroup = productsOfGroup.map(pg => {return {name: pg.name, slug: pg.slug}})
        return itemsOfGroup
    }

    async getByNames(name){
        const products = await Product.findAll({ where:{name: {[Op.startsWith]: name}}, order: ['index']})
        return products.map(p => {return {name: p.name, slug: p.slug}})
    }

    async delete(id){
        return await Product.destroy({where: {id}})
    }

    async swap(items){
        await Promise.all(items.map(async (item, ind) => {
            await Product.update({index: ind + 1}, {where: {name: item.name}})
        }))
    }

    async getLatestDevelopments(){
        const products = await Product.findAll({order: [['createdAt', 'DESC']], limit:4})
            const latestDevelopments = await Promise.all(products.map(async p => {
            const sectionSlug = await productSectionService.get(null, null, p.productSectionId)
            const img = (await imageService.get(p.id))[0]
            return {name: p.name, slug: sectionSlug?.slug + '/' + p.slug, img: {name: img?.name, value: img?.value}}
        }))
        return latestDevelopments
    }
}

module.exports = new ProductService()