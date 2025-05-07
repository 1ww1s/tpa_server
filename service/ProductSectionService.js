const slug = require('slug')
const { ProductSection } = require('../models/models')
const DataBase = require('../error/DataBaseError')
const infoService = require('./InfoService')
const imageService = require('./ImageService')
const { Op } = require('sequelize')
const fileProcessing = require('../middleware/FileProcessing')

class ProductSectionService{
    async create(title, info, imgName, file){
        const titleSlug = slug(title)
        const index = await ProductSection.max('index').catch(e => {throw DataBase.Conflict(e.message)})
        const productSection = await ProductSection.create({title, slug: titleSlug, index: index + 1 }).catch(e => {throw DataBase.Conflict(e.message)})
        if(info) await infoService.create(info, null, productSection.id)
        if(imgName && file){
            const processedImage = await fileProcessing.image('product_group', file)
            await imageService.create(imgName, processedImage.path, 0, null, productSection.id)
        }
    }

    async update(id, title){
        const oldProductSection = await this.get(null, null, id)
        if(!oldProductSection) throw DataBase.NotFound('Данный раздел продукции не найден')
        if(title !== oldProductSection.title){
            const titleSlug = slug(title)
            await ProductSection.update({title, slug: titleSlug}, {where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})
        }
    }

    async delete(id){
        await ProductSection.destroy({where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async swap(items){
        await Promise.all(items.map(async (item, ind) => {
            await ProductSection.update({index: ind + 1}, {where: {title: item.name}}).catch(e => {throw DataBase.Conflict(e.message)})
        }))
    }

    async get(title, slug, id){
        let productSection = null;
        if(title) productSection = await ProductSection.findOne({where:{title}}).catch(e => {throw DataBase.Conflict(e.message)})
        if(slug) productSection = await ProductSection.findOne({where:{slug}}).catch(e => {throw DataBase.Conflict(e.message)})
        if(id) productSection = await ProductSection.findOne({where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})
        return productSection
    }

  async getData(title){
        const productSectionData = await ProductSection.findAll({ where:{title: {[Op.startsWith]: title}}}).catch(e => {throw DataBase.Conflict(e.message)})
        if(!productSectionData) throw DataBase.NotFound('Нет такой группы продукции')
        const productSection = await Promise.all(productSectionData.map(async p => {
            const info = await infoService.get(null, p.id)
            const img = await imageService.get(null, p.id)
            return {id: p.id, title: p.title, slug: p.slug, info: info?.value, img: {id: img?.id, name: img?.name, url: img?.url}}
        }))
        return productSection
    }

    async getAll(isProductSectionData = true){
        const productSectionData = await ProductSection.findAll({order: ['index']}).catch(e => {throw DataBase.Conflict(e.message)})
        if(!isProductSectionData) return productSectionData
        const productSection = await Promise.all(productSectionData.map(async p => {
            const info = await infoService.get(null, p.id)
            const img = await imageService.get(null, p.id)
            return {title: p.title, slug: p.slug, info: info?.value, img: {name: img?.name, url: img?.url}}
        }))
        return productSection
    }

    async getNames(select = null){
        const sectionsData = await ProductSection.findAll({order: ['index']}).catch(e => {throw DataBase.Conflict(e.message)})
        let sections;
        if(select){
            sections = sectionsData.map(s => {return {value: s.slug, name: s.title}})
        }
        else{
            sections = sectionsData.map(s => {return {slug: s.slug, name: s.title, index: s.index}})
        }
        return sections
    }
}

module.exports = new ProductSectionService()