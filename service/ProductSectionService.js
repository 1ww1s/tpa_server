const slug = require('slug')
const { ProductSection, Info } = require('../models/models')
const DataBase = require('../error/DataBaseError')
const infoService = require('./InfoService')
const imageService = require('./ImageService')
const { Op, Sequelize } = require('sequelize')

class ProductSectionService{
    async create(title, info, img){
        const titleSlug = slug(title)
        const index = await ProductSection.max('index')
        const productSection = await ProductSection.create({title, slug: titleSlug, index: index + 1 } )
        .catch(e => {throw DataBase.UnprocessableEntity('Название раздела должно быть уникальным')})
        if(info) await infoService.create(info, null, productSection.id)
        if(img) await imageService.create(img.name, img.value, 0, null, productSection.id)
    }

    async update(id, title){
        const oldProductSection = await this.get(null, null, id)
        if(!oldProductSection) throw DataBase.NotFound('Данный раздел продукции не найден')
        const titleSlug = slug(title)
        await ProductSection.update({title, slug: titleSlug}, {where: {id}})
    }

    async delete(id){
        await ProductSection.destroy({where: {id}})
    }

    async swap(items){
        await Promise.all(items.map(async (item, ind) => {
            await ProductSection.update({index: ind + 1}, {where: {title: item.name}})
        }))
    }

    async get(title, slug, id){
        let productSection = null;
        if(title) productSection = await ProductSection.findOne({where:{title}})
        if(slug) productSection = await ProductSection.findOne({where:{slug}})
        if(id) productSection = await ProductSection.findOne({where: {id}})
        return productSection
    }

  async getData(title){
        const productSectionData = await ProductSection.findAll({ where:{title: {[Op.startsWith]: title}}})
        if(!productSectionData) throw DataBase.NotFound('Нет такой группы продукции')
        const productSection = await Promise.all(productSectionData.map(async p => {
            const info = await infoService.get(null, p.id)
            const img = await imageService.get(null, p.id)
            return {id: p.id, title: p.title, slug: p.slug, info: info?.value, img: {name: img?.name, value: img?.value}}
        }))
        return productSection
    }

    async getAll(isProductSectionData = true){
        const productSectionData = await ProductSection.findAll({order: ['index']})
        if(!isProductSectionData) return productSectionData
        const productSection = await Promise.all(productSectionData.map(async p => {
            const info = await infoService.get(null, p.id)
            const img = await imageService.get(null, p.id)
            return {title: p.title, slug: p.slug, info: info?.value, img: {name: img?.name, value: img?.value}}
        }))
        return productSection
    }

    async getNames(select = null){
        const sectionsData = await ProductSection.findAll({order: ['index']})
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