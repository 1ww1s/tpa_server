const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const RequestError = require('../error/RequestError');

const FileProcessing = {

    async image(startNameFile, file) {
        if (!file) return null;
        try {
            const uploadDir = path.join(__dirname, '../../uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
        
            const filename = `${startNameFile}-${Math.round(Math.random() * 1E9)}.webp`;
            const filepath = path.join(uploadDir, filename);
        
            await sharp(file.buffer)
                .resize(1200, 1200, { // Оптимальный размер для большинства случаев  // подумать - это будет максимальный размер
                    fit: sharp.fit.inside,
                    withoutEnlargement: true
                })
                .webp({ quality: 80 }) // Оптимальное качество
                .toFile(filepath)
        
            // Сохраняем метаданные для контроллера
            const processedImage = {
                filename,
                path: `/uploads/${filename}`
            };
            return processedImage
        } 
        catch (err) {
            throw RequestError.BadRequest(err.message);
        }
    },
    
    async images(startNameFile, files) {
        try {
            if(!files) return null
            const uploadDir = path.join(__dirname, '../../uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
    
            const processedImages = []
            await Promise.all(files.map(async (file, ind) => {
                const filename = `${startNameFile}-${Date.now()}-${ind + 1}.webp`;
                const filepath = path.join(uploadDir, filename);
                
                await sharp(file.buffer)
                    .resize(1200, 1200, { // Оптимальный размер для большинства случаев  // подумать - это будет максимальный размер
                        fit: sharp.fit.inside,
                        withoutEnlargement: true
                    })
                    .webp({ quality: 80 }) // Оптимальное качество
                    .toFile(filepath)
            
                processedImages[ind] = {
                    filename,
                    path: `/uploads/${filename}`
                }
            }))
            return processedImages;
        } 
        catch (err) {
            throw RequestError.BadRequest(err.message);
        }
    },

    async files(startNameFile, files){
        try {
            if(!files) return null
            const uploadDir = path.join(__dirname, '../../uploads/pdfs');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
    
            const processedImages = []
            await Promise.all(files.map(async (file, ind) => {
                const filename = `${startNameFile}-${Date.now()}-${ind + 1}.pdf`;
                const filepath = path.join(uploadDir, filename);
                
                fs.writeFile(filepath, file.buffer, (err) => {
                    if (err) {
                      return res.status(500).send('Ошибка сохранения файла: ' + err.message);
                    }
                })

                processedImages[ind] = {
                    filename,
                    path: `/uploads/pdfs/${filename}`
                }
            }))
            return processedImages;
        } 
        catch (err) {
            throw RequestError.BadRequest(err.message);
        }
    }
}


module.exports = FileProcessing