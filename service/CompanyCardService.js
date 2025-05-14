const fs = require('fs');
const deleteFileService = require('./DeleteFileService');
const path = require('path');
const fileProcessing = require('../middleware/FileProcessing');
const { CompanyCard } = require('../models/models');

class CompanyCardService{

    async update(file){
        const data = (await CompanyCard.findAll())[0]
        const processedFile = await fileProcessing.file('companyCard', file)
        if(!data){
            await CompanyCard.create({url: processedFile.path})
        }
        else{
            const p = path.join(__dirname, '../..', data.url)
            await deleteFileService.safeDeleteFile(p)
            await CompanyCard.update({url: processedFile.path}, {where: {id: data.id}})
        }
    }

    async get(){
        const data = (await CompanyCard.findAll())[0]

        if (data) {
            return {
                name: 'Карточка предприятия',
                url: data.url
            }
        } else {
            return {
                name: 'Карточка предприятия',
            }
        }
    
    }

}


module.exports = new CompanyCardService()