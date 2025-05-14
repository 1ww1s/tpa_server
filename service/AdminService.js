const RequestError = require('../error/RequestError')
const productSectionService = require('./ProductSectionService')
const productService = require('./ProductService')
const roleService = require('./RoleService')
const unitService = require('./UnitService')
const functionService = require('./FunctionService')
const monAndIndParamService = require('./MonAndIndParamService')
const imageService = require('./ImageService')
const deliverySetService = require('./DeliverySetService')
const infoService = require('./InfoService')
const modificationService = require('./ModificationService')
const techCharacteristicService = require('./TechCharacteristicService')
const userService = require('./UserService')
const DataBase = require('../error/DataBaseError')
const contactService = require('./ContactService')
const certificateService = require('./CertificateService')
const partnerService = require('./PartnerService')
const requisiteService = require('./RequisiteService')
const latestDevelopmentService = require('./LatestDevelopmentService')
const informationDisclosureService = require('./InformationDisclosureService')
const deleteFileService = require('./DeleteFileService')
const path = require('path')
const fileProcessing = require('../middleware/FileProcessing')
const sizeService = require('./SizeService')
const companyCardService = require('./CompanyCardService')

class AdminService{

    async createProductSection(title, info, imgName, file){
        await productSectionService.create(title, info, imgName, file)
    }

    async createLatestDevelopments(latestDevelopment, file){
        await latestDevelopmentService.create(latestDevelopment.title, latestDevelopment.link, file)
    }

    async deleteLatestDevelopment(id){
        await latestDevelopmentService.delete(id)
    }

    async updateProductSection(productSection, imageName, file){
        await productSectionService.update(productSection.id, productSection.title)
        await infoService.update(null, productSection)
        if(file){
            const processedImage = await fileProcessing.image('product_group', file)
            const imageUrl = processedImage.path;
            const oldImg = await imageService.get(null, productSection.id)
            if(oldImg){
                await imageService.update(oldImg.id, imageName, imageUrl)
                const p = path.join(__dirname, '..', oldImg.url)
                await deleteFileService.safeDeleteFile(p)
            }
            else{
                await imageService.create(imageName, imageUrl, 0, null, productSection.id)
            }
        }
    }

    async deleteProductSection(productSectionId){  // здесь не правильно и помотреть другие delete, где удаляется один файл
        const imageData = await imageService.get(null, productSectionId)
        if(!imageData){
            throw DataBase.NotFound('Изображение не найдено')
        }
        await imageService.delete(imageData.id)
        await productSectionService.delete(productSectionId)
    }

    async swapProductSection(items){
        await productSectionService.swap(items)
    }

    async createProduct(product, files, sizeFile){
        const productSectionData = await productSectionService.get(null, product.groupSlug) 
        if(!productSectionData) throw RequestError.BadRequest('Такого названия раздела продукции не существует')
        await productService.create(productSectionData.id, product, files, sizeFile)
    }

    async createCertificate(certificate, file){
        await certificateService.create(certificate.name, file, certificate.endDate)
    }
    async updateCertificate(certificate, file){
        await certificateService.update(certificate, file)
        
    }
    async deleteCertificate(certificateId){
        await certificateService.delete(certificateId)
    }
    
    //
    
    async createInformationDisclosure(informationDisclosure, files){
        await informationDisclosureService.createAll(informationDisclosure.name, informationDisclosure.files, files)
    }
    async updateInformationDisclosure(informationDisclosure, files){
        const processedFiles = await fileProcessing.files('pdf', files)
        await informationDisclosureService.updateAll(informationDisclosure.id, informationDisclosure.name, informationDisclosure.files, processedFiles)
    }
    async deleteInformationDisclosure(informationDisclosureId){
        await informationDisclosureService.delete(informationDisclosureId)
    }

    //

    async updateRequisite(requisite){
        await requisiteService.update(requisite.id, requisite.name, requisite.value)
    }
    async updateCompanyCard(file){
        await companyCardService.update(file)
    }
    async deleteRequisite(requisiteId){
        await requisiteService.delete(requisiteId)
    }
    async createRequisite(requisite){
        await requisiteService.create(requisite.name, requisite.value)
    }

    async createPartner(partner){
        await partnerService.create(partner.name, partner.img.value)
    }
    async updatePartner(partner){
        await partnerService.update(partner)
    }
    async deletePartner(partnerId){
        await partnerService.delete(partnerId)
    }

    async createOrUpdateContact(contact){
        await contactService.createOrUpdate(contact)
    }

    async createFunctions(productId, functions){
        const product = await productService.get(productId)
        if(!product) throw RequestError.BadRequest('Продукт не найден')
        await functionService.create(functions, productId)
    }

    async createTechCharacteristics(productId, techCharacteristics){
        const product = await productService.get(productId)
        if(!product) throw RequestError.BadRequest('Продукт не найден')
        await techCharacteristicService.createAll(techCharacteristics, productId)
    }
    
    async createDeliverySet(productId, deliverySet){
        const product = await productService.get(productId)
        if(!product) throw RequestError.BadRequest('Продукт не найден')
        await deliverySetService.createAll(deliverySet, productId)
    }
    
    async createModifications(productId, modifications){
        const product = await productService.get(productId)
        if(!product) throw RequestError.BadRequest('Продукт не найден')
        await modificationService.createAll(modifications, productId)
    }

    async createImages(productId, images){
        const product = await productService.get(productId)
        if(!product) throw RequestError.BadRequest('Продукт не найден')
        await imageService.createAll(images, productId)
    }

    async createMonAndIndParams(productId, monAndIndParams){
        const product = await productService.get(productId)
        if(!product) throw RequestError.BadRequest('Продукт не найден')
        await monAndIndParamService.create(monAndIndParams, productId)
    }

    async deleteProduct(productId){
        await imageService.deleteAll(productId)
        await productService.delete(productId)
    }

    async swapProduct(items){
        await productService.swap(items)
    }

    async updateProduct(product, files, sizeFile){
        await productService.update(product)
        await infoService.update(product)
        const processedImages = await fileProcessing.images('product', files)
        await imageService.updateAll(product.id, product.images, processedImages)
        if(sizeFile){
            const old = await sizeService.get(product.id)
            const processedImages = await fileProcessing.files('size', [sizeFile])
            if(old){
                await sizeService.deleteFile(product.id)
                await sizeService.update(old.id, processedImages[0].path)
            }
            else{
                await sizeService.create(processedImages[0].path, product.id)
            }
        }
        else{
            const old = await sizeService.get(product.id)
            if(old){
                await sizeService.deleteFile(product.id)
                await sizeService.delete(old.id)
            }
        }
        // await functionService.update(product.id, product.functions)
        // await monAndIndParamService.update(product.id, product.monAndIndParams)
        // await modificationService.updateAll(product.id, product.modifications)
        await deliverySetService.updateAll(product.id, product.deliverySet)
        await techCharacteristicService.updateAll(product.id, product.techCharacteristics)
    }
    
    async updateProductOptions(product){
        await functionService.update(product.id, product.functions)
        await monAndIndParamService.update(product.id, product.monAndIndParams)
        await modificationService.updateAll(product.id, product.modifications)
    }

    async createRole(value){
        await roleService.create(value)
    }

    async createUnit(value){
        await unitService.create(value)
    }

    async updateUnit(unit){
        await unitService.update(unit.id, unit.value)
    }

    async addUserRole(email, role){
        const userData = await userService.get(email)
        if(!userData) throw DataBase.NotFound('Такого пользователя нет')
        if(role === 'admin' || role === 'user') throw RequestError.BadRequest('Данную роль нельзя добавить') 
        const roleData = await roleService.get(role) 
        if(!roleData) throw DataBase.NotFound('Такой роли нет')
        await userService.addRole(userData.id, roleData.id)
    }

    async deleteUserRole(email, role){
        const userData = await userService.get(email)
        if(!userData) throw DataBase.NotFound('Такого пользователя нет')
        if(role === 'admin' || role === 'user') throw RequestError.BadRequest('Данную роль нельзя удалить') 
        const roleData = await roleService.get(role) 
        if(!roleData) throw DataBase.NotFound('Такой роли нет')
        await userService.deleteRole(userData.id, roleData.id)
    }

    async getRoles(){
        const rolesData = await roleService.getAll()
        return rolesData.filter(r => (r.value !== 'admin') && (r.value !== 'user')).map(r => {return {id: r.id, value: r.value}})
    }

    async getUsers(){
        const usersData = await userService.getAll()
        return usersData.map(user => {return {id: user.id, email: user.email, roles: user.roles.map(role => role.value)}})
    }
    
    async getUser(email){
        const userData = await userService.get(email)
        if(!userData) throw DataBase.NotFound('Пользователь не найден')
            const user = {email, roles: userData.roles.map(role => role.value)}
        return user
    }
    // async addUser(email){
    //     await  userService .update(unit.id, unit.value)
    // }
}

module.exports = new AdminService()