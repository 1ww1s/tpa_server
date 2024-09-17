const DataBase = require("../error/DataBaseError")
const { Contact } = require("../models/models")



class ContactService{

    async createOrUpdate(contact){ 
        const contactData = await Contact.findAndCountAll()
        if(contactData.count){
            await Contact.update({email: contact.email, telephone: contact.telephone, address: contact.address, openingHours: contact.openingHours}, {where: {id: contactData.rows[0].id}})
        }
        else{
            await Contact.create({email: contact.email, telephone: contact.telephone, address: contact.address, openingHours: contact.openingHours})
        }
    }

    async get(){
        let contactData = (await Contact.findAll())[0]
        if(!contactData) contactData = {email: '', telephone: '', address: '', openingHours: ''}
        const contact = {email: contactData.email, telephone: contactData.telephone, address: contactData.address, openingHours: contactData.openingHours}
        return contact
    }
}

module.exports = new ContactService()