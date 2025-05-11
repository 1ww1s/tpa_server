const { Certificate } = require('../models/models');
const DataBase = require('../error/DataBaseError');
const path = require('path');
const deleteFileService = require('./DeleteFileService');
const fileProcessing = require('../middleware/FileProcessing');


class CertificateService {

    async create(name, file, endDate){
        const processedImage = await fileProcessing.image('certificate', file)
        await Certificate.create({name, imageUrl: processedImage.path, endDate}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async delete(id){
        const old = await this.get(null, id)
        if(!old){
            throw DataBase.NotFound(`Сертификат с id=${id} не найден`)
        }
        await Certificate.destroy({where:{id}}).catch(e => {throw DataBase.Conflict(e.message)})
        const p = path.join(__dirname, '..', old.imageUrl)
        await deleteFileService.safeDeleteFile(p)
    }

    async get(name, id){
        let certificate;
        if(name) certificate = await Certificate.findOne({where: {name}}).catch(e => {throw DataBase.Conflict(e.message)})
        else certificate = await Certificate.findOne({where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})
        return certificate;
    }

    async update(certificate, file){
        if(file){
            const certificateOld = await this.get(null, certificate.id)
            const processedImage = await fileProcessing.image('certificate', file)
            const imageUrl = processedImage.path;
            await Certificate.update(
                {name: certificate.name, imageUrl, endDate: certificate.endDate}, {where: {id: certificate.id}}
            ).catch(e => {throw DataBase.Conflict(e.message)})
            const p = path.join(__dirname, '..', certificateOld.imageUrl)
            await deleteFileService.safeDeleteFile(p)
        }
        else{
            await Certificate.update(
                {name: certificate.name, endDate: certificate.endDate}, {where: {id: certificate.id}}
            ).catch(e => {throw DataBase.Conflict(e.message)})
        }
    }

    async getAll(){
        const certificates = await Certificate.findAll()
        return certificates.map(c => {return {id: c.id, name: c.name, img: {name: c.name, url: c.imageUrl}, endDate: c.endDate}})
    }

    // async updateAll(certificates){
    //     const isPresent = {};
    //     certificates = await Promise.all(certificates.map(async (certificate) => {
    //         if(!certificate.id || !certificate.name || !certificate.value) throw RequestError.BadRequest('Одно из обязательных полей пустое')
    //         if(~certificate.id){
    //             isPresent[certificate.id] = true;
    //             const oldCertificate = oldItems.find(oldI => oldI.id === certificate.id)
    //             if(i.name !== oldI.name) await this.update(certificate.id, certificate.name)
    //             return i
    //         }
    //         else{
    //             return await this.create(i.name, productId)
    //         }
    //     }))
    //     await Promise.all(oldItems.map(async i => {
    //         if(!isPresent[i.id]) await this.delete(i.id)
    //     }))
    //     return items
    // }
}


module.exports = new CertificateService()