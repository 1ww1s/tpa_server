const RequestError = require("../error/RequestError");
const productService = require("../service/ProductService");
const unitService = require("../service/UnitService");
const productSection = require('../service/ProductSectionService')
const contactService = require('../service/ContactService')
const certificateService = require('../service/CertificateService');
const partnerService = require("../service/PartnerService");
const requisiteService = require("../service/RequisiteService");
const latestDevelopmentService = require("../service/LatestDevelopmentService");
const informationDisclosureService = require("../service/InformationDisclosureService");

class SiteController{

    async getProduct(req, res, next){
        try {   
            // await new Promise(resolve => setTimeout(resolve, 14000))
            const slug = req.params.slug;
            if(!slug) throw RequestError.BadRequest('Нет названия продукта')
            const product = await productService.getAll(slug)
            res.json(product)
        }
        catch(e){
            next(e)
        }
    }

    async getProductImages(req, res, next){
        try {   
            // await new Promise(resolve => setTimeout(resolve, 14000))
            const slug = req.params.slug;
            if(!slug) throw RequestError.BadRequest('Нет названия продукта')
            const images = await productService.getImages(slug)
            res.json(images)
        }
        catch(e){
            next(e)
        }
    }

    async getProductNameBySlug(req, res, next){
        try {   
            const slug = req.params.slug;
            if(!slug) throw RequestError.BadRequest('Не указан slug')
            const productName = await productService.getNameBySlug(slug)
            res.json(productName)
        }
        catch(e){
            next(e)
        }
    }

    async getProductsByName(req, res, next){
        try {   
            const name = req.params.name;
            if(!name) throw RequestError.BadRequest('Нет названия продукта')
            const products = await productService.getByNames(name)
            res.json(products)
        }
        catch(e){
            next(e)
        }
    }

    async getProductItemNames(req, res, next){
        try {   
            const products = await productService.getItems()
            res.json(products)
        }
        catch(e){
            next(e)
        }
    }

    async getProductItemsOfGroup(req, res, next){
        try {   
            const slug = req.params.slug;
            if(!slug) throw RequestError.BadRequest('Нет названия продукта')
            const itemsOfGroup = await productService.getItemsOfGroup(slug)
            res.json(itemsOfGroup)
        }
        catch(e){
            next(e)
        }
    }

    async getProductItemsByGroup(req, res, next){
        try {   
            const slug = req.params.slug;
            if(!slug) throw RequestError.BadRequest('Нет названия раздела')
            const itemsOfGroup = await productService.getItemsByGroup(slug)
            res.json(itemsOfGroup)
        }
        catch(e){
            next(e)
        }
    }

    async getGroupNames(_, res, next){
        try{
            const names = await productSection.getNames(true)
            res.json(names)
        }
        catch(e){
            next(e)
        }
    }

    async getGroupItemNames(_, res, next){
        try{
            const names = await productSection.getNames(false)
            res.json(names)
        }
        catch(e){
            next(e)
        }
    }

    async getGroupAll(_, res, next) {
        try{
            const productGroup = await productSection.getAll()
            res.json(productGroup)
        }
        catch(e){
            next(e)
        }
    }

    async getGroupByTitle(req, res, next) {
        try{
            const title = req.params.title;
            const productGroup = await productSection.getData(title)
            res.json(productGroup)
        }
        catch(e){
            next(e)
        }
    }

    // InformationDisclosure

    async getInformationDisclosureStartsWith(req, res, next) {
        try{
            const name = req.body.name;
            const itemsData = await informationDisclosureService.startsWith(name)
            res.json(itemsData.map(item => ({name: item.name})))
        }
        catch(e){
            next(e)
        }
    }

    async getInformationDisclosureByName(req, res, next) {
        try{
            const name = req.body.name;
            const informationDisclosure = await informationDisclosureService.getWithFiles(name)
            res.json(informationDisclosure)
        }
        catch(e){
            next(e)
        }
    }

    async getAllInformationDisclosure(req, res, next) {
        try{
            const informationDisclosures = await informationDisclosureService.getAll()
            console.log(informationDisclosures)
            res.json(informationDisclosures)
        }
        catch(e){
            next(e)
        }
    }

    //

    async getGroupNameBySlug(req, res, next) {
        try{
            const slug = req.params.slug;
            const productGroup = await productSection.get(null, slug)
            res.json({name: productGroup.title, slug})
        }
        catch(e){
            next(e)
        }
    }

    async getGroupBySlug(req, res, next) {
        try{
            const slug = req.params.slug;
            const productGroup = await productSection.get(null, slug)
            res.json(productGroup)
        }
        catch(e){
            next(e)
        }
    }


    async getProductPreviews(req, res, next){
        try{
            const slug = req.params.slug;
            const productGroup = await productService.getPreviews(slug)
            res.json(productGroup)
        }
        catch(e){
            next(e)
        }
    }

    async getProductPreview(req, res, next){
        try{
            const slug = req.params.slug;
            const productPreview = await productService.getPreview(slug)
            res.json(productPreview)
        }
        catch(e){
            next(e)
        }
    }

    async getUnit(_, res, next){
        try{
            const unit = await unitService.getAll()
            res.json(unit)
        }
        catch(e){
            next(e)
        }
    }

    async getUnitsByValue(req, res, next){
        try{
            const value = req.params.value;
            const units = await unitService.getArrayByVal(value)
            res.json(units)
        }
        catch(e){
            next(e)
        }
    }


    async getContact(_, res, next){
        try{
            const contact = await contactService.get()
            res.json(contact)
        }
        catch(e){
            next(e)
        }
    }

    async getCertificates(req, res, next){
        try{
            const certificates = await certificateService.getAll()
            res.json(certificates)
        }
        catch(e){
            next(e)
        }
    }

    
    async getPartners(req, res, next){
        try{
            const partners = await partnerService.getAll()
            res.json(partners)
        }
        catch(e){
            next(e)
        }
    }

    async getPartnersNames(req, res, next){
        try{
            const partnersNames = await partnerService.getNames()
            res.json(partnersNames)
        }
        catch(e){
            next(e)
        }
    }

    async getLatestDevelopments(_, res, next){
        try{
            const latestDevelopments = await latestDevelopmentService.get()
            res.json(latestDevelopments)
        }
        catch(e){
            next(e)
        }
    }

    async getLatestDevelopmentsItems(_, res, next){
        try{
            const items = await latestDevelopmentService.getItems()
            res.json(items)
        }
        catch(e){
            next(e)
        }
    }

    async getRequisites(_, res, next){
        try{
            const requisites = await requisiteService.getAll()
            res.json(requisites)
        }
        catch(e){
            next(e)
        }
    }
}

module.exports = new SiteController()