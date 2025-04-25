const { Op } = require('sequelize');
const { Certificate } = require('../models/models')


class CertificateService {

    async create(name, img, endDate){
        await Certificate.create({name, img, endDate}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async delete(id){
        await Certificate.destroy({where:{id}}).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async get(name, id){
        let certificate;
        if(name) certificate = await Certificate.findOne({where: {name}}).catch(e => {throw DataBase.Conflict(e.message)})
        else certificate = await Certificate.findOne({where: {id}}).catch(e => {throw DataBase.Conflict(e.message)})
        return certificate;
    }

    async update(certificate){
        await Certificate.update(
            {name: certificate.name, img: certificate.img.value, endDate: certificate.endDate}, {where: {id: certificate.id}}
        ).catch(e => {throw DataBase.Conflict(e.message)})
    }

    async getAll(){
        const certificates = await Certificate.findAll()
        return certificates.map(c => {return {id: c.id, name: c.name, img: {name: c.name, value: c.img}, endDate: c.endDate}})
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