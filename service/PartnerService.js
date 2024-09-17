const { Partner } = require('../models/models')

class PartnerService {

    async create(name, img){
        await Partner.create({name, img})
    }

    async delete(id){
        await Partner.destroy({where:{id}})
    }

    // async get(name, id){
    //     let certificate;
    //     if(name) certificate = await Certificate.findOne({where: {name}})
    //     else certificate = await Certificate.findOne({where: {id}})
    //     return certificate;
    // }

    async update(partner){
        await Partner.update({name: partner.name, img: partner.img.value}, {where: {id: partner.id}})
    }

    async getAll(){
        const partners = await Partner.findAll()
        return partners.map(p => {return {id: p.id, name: p.name, img: {name: p.name, value: p.img}}})
    }

    async getNames(){
        const partners = await Partner.findAll()
        return partners.map(p => {return {name: p.name}})
    }

}


module.exports = new PartnerService()