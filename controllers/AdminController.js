const RequestError = require('../error/RequestError');
const adminService = require('../service/AdminService');
// await new Promise(resolve => setTimeout(resolve, 4000))

class AdminController{

    async createRole(req, res, next){
        try{
            const {value} = req.body;
            if(!value) throw RequestError.BadRequest('Нет названия роли')
            await adminService.createRole(value)
            res.json({message: `Роль "${value}" успешно добавлена`})
        }  
        catch(e){
            next(e)
        }
    }

    async createLatestDevelopments(req, res, next){
        try{
            const file = req.file;
            const latestDevelopment = JSON.parse(req.body.data);
            if(!latestDevelopment.title || !latestDevelopment.link || !file) 
                throw RequestError.BadRequest('Одно из обязательных полей пустое(latestDevelopment.title, latestDevelopment.link, file)')
            await adminService.createLatestDevelopments(latestDevelopment, file)
            res.json({message: `Последняя разработка успешно добавлена`})
        }
        catch(e){
            next(e)
        }
    }

    async deleteLatestDevelopments(req, res, next){
        try{
            const {id} = req.body;
            if(!id) throw RequestError.BadRequest('id не указан')
            await adminService.deleteLatestDevelopment(id)
            res.json({message: `Последняя разработка успешно удалена`})
        }
        catch(e){
            next(e)
        }
    }

    // ProductSection

    async createProductSection(req, res, next){
        try{
            const file = req.file;
            const productSection = JSON.parse(req.body.data);
            if(!productSection.title || !productSection.info || !productSection.img.name || !file) 
                throw RequestError.BadRequest('Одно из обязательных полей пустое(productSection.title, productSection.info, productSection.img.name, file)')
            await adminService.createProductSection(productSection.title, productSection.info, productSection.img.name, file)
            res.json({message: `Раздел продукции успешно добавлен`})
        }
        catch(e){
            next(e)
        }
    }

    async updateProductSection(req, res, next){
        try{
            const file = req.file;
            const productSection = JSON.parse(req.body.data);
            if(!productSection.title || !productSection.info || !productSection.img) 
                throw RequestError.BadRequest('Одно из обязательных полей пустое(productSection.title, productSection.info, productSection.img)')
            await adminService.updateProductSection(productSection, productSection.img.name, file)
            res.json({message: `Раздел продукции успешно обновлен`})
        }
        catch(e){
            next(e)
        }
    }

    async deleteProductSection(req, res, next){
        try{
            const {productGroupId: productSectionId} = req.body;
            if(!productSectionId) throw RequestError.BadRequest('Раздел продукции не указан')
            await adminService.deleteProductSection(productSectionId)
            res.json({message: `Раздел продукции успешно удален`})
        }
        catch(e){
            next(e)
        }
    }

    async swapProductSection(req, res, next){
        try{
            const {items} = req.body;
            if(!items?.length) throw RequestError.BadRequest('Разделы продукции не указан')
            await adminService.swapProductSection(items)
            res.json({message: `Разделы продукции успешно переставлены местами`})
        }
        catch(e){
            next(e)
        }
    }

    async createProduct(req, res, next){
        try{
            const imagesFiles = req.files.images;
            const sizeFile = req.files.size ? req.files.size[0] : null;
            const product = JSON.parse(req.body.data);
            if(!product.name || !product.info || !product.images.length) 
                throw RequestError.BadRequest('Одно из обязательных полей пустое(product.name, product.info, product.images.length)')
            await adminService.createProduct(product, imagesFiles, sizeFile)
            res.json({message: `Продукция успешно добавлена`})
        }
        catch(e){
            next(e)
        }
    }

    async createCertificate(req, res, next){
        try{
            const file = req.file;
            const certificate = JSON.parse(req.body.data);
            if(!certificate.name || !certificate.img || !certificate.endDate || !file) 
                throw RequestError.BadRequest('Одно из обязательных полей пустое(certificate.name, certificate.img, certificate.endDate, file)')
            await adminService.createCertificate(certificate, file)
            res.json({message: `Сертификат успешно добавлен`})
        }
        catch(e){
            next(e)
        }
    }

    async updateCertificate(req, res, next){
        try{
            const file = req.file;
            const certificate = JSON.parse(req.body.data);
            if(!certificate.name || !certificate.img || !certificate.endDate) 
                throw RequestError.BadRequest('Одно из обязательных полей пустое(certificate.name, certificate.img, certificate.endDate)')
            await adminService.updateCertificate(certificate, file)
            res.json({message: `Сертификаты успешно обновлен`})
        }
        catch(e){
            next(e)
        }
    }

    async deleteCertificate(req, res, next){
        try{
            const {certificateId} = req.body;
            if(!certificateId) throw RequestError.BadRequest('Сертификат не указан')
            await adminService.deleteCertificate(certificateId)
            res.json({message: `Сертификат успешно удален`})
        }
        catch(e){
            next(e)
        }
    }

    async createRequisite(req, res, next){
        try{
            const {requisite} = req.body;
            if(!requisite) throw RequestError.BadRequest('Реквизит не указан')
            if(!requisite.name || !requisite.value) throw RequestError.BadRequest('Одно из обязательных полей пустое')
            await adminService.createRequisite(requisite)
            res.json({message: `Реквизит успешно добавлен`})
        }
        catch(e){
            next(e)
        }
    }

    async updateRequisite(req, res, next){
        try{
            const {requisite} = req.body;
            if(!requisite) throw RequestError.BadRequest('Реквизит не указан')
            if(!requisite.id || !requisite.name || !requisite.value) throw RequestError.BadRequest('Одно из обязательных полей пустое')
            await adminService.updateRequisite(requisite)
            res.json({message: `Реквизит успешно обновлен`})
        }
        catch(e){
            next(e)
        }
    }

    async deleteRequisite(req, res, next){
        try{
            const {requisiteId} = req.body;
            if(!requisiteId) throw RequestError.BadRequest('Реквизит не указан')
            await adminService.deleteRequisite(requisiteId)
            res.json({message: `Реквизит успешно удален`})
        }
        catch(e){
            next(e)
        }
    }
    
    async createPartner(req, res, next){
        try{
            const {partner} = req.body;
            if(!partner) throw RequestError.BadRequest('Информация о партнере не указана')
            if(!partner.name || !partner.img) throw RequestError.BadRequest('Одно из обязательных полей пустое')
            await adminService.createPartner(partner)
            res.json({message: `Партнер успешно добавлен`})
        }
        catch(e){
            next(e)
        }
    }

    async updatePartner(req, res, next){
        try{
            const {partner} = req.body;
            if(!partner) throw RequestError.BadRequest('Информация о партнере не указана')
            if(!partner.name || !partner.img) throw RequestError.BadRequest('Одно из обязательных полей пустое')
            await adminService.updatePartner(partner)
            res.json({message: `Партнер успешно обновлен`})
        }
        catch(e){
            next(e)
        }
    }

    async deletePartner(req, res, next){
        try{
            const {partnerId} = req.body;
            if(!partnerId) throw RequestError.BadRequest('Информация о партнере не указана')
            await adminService.deletePartner(partnerId)
            res.json({message: `Партнер успешно удален`})
        }
        catch(e){
            next(e)
        }
    }

    async createOrUpdateContact(req, res, next){
        try{
            const {contact} = req.body;
            if(!contact) throw RequestError.BadRequest('Контакты не указаны')
            if(!contact.email || !contact.telephone || !contact.address || !contact.openingHours ) throw RequestError.BadRequest('Одно из обязательных полей пустое')
            await adminService.createOrUpdateContact(contact)
            res.json({message: `Контакты успешно обновлены`})
        }
        catch(e){
            next(e)
        }
    }

    async updateProduct(req, res, next){
        try{
            const imagesFiles = req.files.images;
            const sizeFile = req.files.size ? req.files.size[0] : null;
            const product = JSON.parse(req.body.data);
            if(!product.id || !product.name || !product.info || !product.images.length) 
                throw RequestError.BadRequest('Одно из обязательных полей пустое(product.id, product.name, product.info, product.images.length)')
            await adminService.updateProduct(product, imagesFiles, sizeFile)
            res.json({message: 'Успешное обновление'})
        }
        catch(e){
            next(e)
        }
    }

    async updateProductOptions(req, res, next){
        try{
            const {product} = req.body
            await adminService.updateProductOptions(product)
            res.json({message: 'Успешное обновление'})
        }
        catch(e){
            next(e)
        }
    }

    async createUnit(req, res, next){
        try{
            const {value} = req.body;
            if(!value) throw RequestError.BadRequest('Нет значения')
            await adminService.createUnit(value)
            res.json({message: `Единица измерения успешно добавлена`})
        }
        catch(e){
            next(e)
        }
    }
    
    async updateUnit(req, res, next){
        try{
            const {unit} = req.body;
            if(!unit) throw RequestError.BadRequest('Единица измерения не указана')
            if(!unit.id || !unit.value) throw RequestError.BadRequest('Одно из обязательных полей пустое')
            await adminService.updateUnit(unit)
            res.json({message: `Единица измерения успешно обновлена`})
        }
        catch(e){
            next(e)
        }
    }

    async deleteProduct(req, res, next){
        try{
            const {productId} = req.body;
            if(!productId) throw RequestError.BadRequest('Продукт не указан')
            await adminService.deleteProduct(productId)
            res.json({message: 'Продукт успешно удален'})
        }
        catch(e){
            next(e)
        }
    }

    async swapProduct(req, res, next){
        try{
            const {items} = req.body;
            if(!items?.length) throw RequestError.BadRequest('Продукты не указаны')
            await adminService.swapProduct(items)
            res.json({message: `Разделы продукции успешно переставлены местами`})
        }
        catch(e){
            next(e)
        }
    }

    async getUser(req, res, next){
        try{
            const {email} = req.body;
            if(!email) throw RequestError.BadRequest('Пользователь не указан')
            const user = await adminService.getUser(email)
            res.json(user)
        }
        catch(e){
            next(e)
        }
    }

    async addUserRole(req, res, next){
        try{
            const {email, role} = req.body;
            if(!email || !role) throw RequestError.BadRequest('Одно из обязательных полей пустое')
            await adminService.addUserRole(email, role)
            res.json({message: `Роль пользователя успешно добавлена`})
        }
        catch(e){
            next(e)
        }
    }

    async deleteUserRole(req, res, next){
        try{
            const {email, role} = req.body;
            if(!email || !role) throw RequestError.BadRequest('Одно из обязательных полей пустое')
            await adminService.deleteUserRole(email, role)
            res.json({message: `Роли пользователя успешно удалена`})
        }
        catch(e){
            next(e)
        }
    }

    async getRoles(req, res, next){
        try{
            const roles = await adminService.getRoles()
            res.json(roles)
        }
        catch(e){
            next(e)
        }
    }

    async getUsers(req, res, next){
        try{
            const users = await adminService.getUsers()
            res.json(users)
        }
        catch(e){
            next(e)
        }
    }

    // InformationDisclosure 

    async createInformationDisclosure(req, res, next){
        try{
            const files = req.files;
            const informationDisclosure = JSON.parse(req.body.data);
            if(!informationDisclosure || !informationDisclosure.name || !informationDisclosure.files.length) 
                throw RequestError.BadRequest('Одно из обязательных полей пустое(informationDisclosure, informationDisclosure.name, informationDisclosure.files.length)')
            await adminService.createInformationDisclosure(informationDisclosure, files)
            res.json({message: `Раздел раскрытия информации успешно добавлен`})
        }
        catch(e){
            next(e)
        }
    }

    async updateInformationDisclosure(req, res, next){
        try{
            const files = req.files;
            const informationDisclosure = JSON.parse(req.body.data);
            if(!informationDisclosure || !informationDisclosure.name || !informationDisclosure.files.length) 
                throw RequestError.BadRequest('Одно из обязательных полей пустое(informationDisclosure, informationDisclosure.name, informationDisclosure.files.length)')
            await adminService.updateInformationDisclosure(informationDisclosure, files)
            res.json({message: `Раздел раскрытия информации успешно обновлен`})
        }
        catch(e){
            next(e)
        }
    }

    async deleteInformationDisclosure(req, res, next){
        try{
            const {id} = req.body;
            if(!id) throw RequestError.BadRequest('id раздела раскрытия информации не указан')
            await adminService.deleteInformationDisclosure(id)
            res.json({message: `Раздел раскрытия информации успешно удален`})
        }
        catch(e){
            next(e)
        }
    }

    //

}

module.exports = new AdminController()