const multer = require('multer');
const path = require('path');
const fs = require('fs');

module.exports = {

  image: multer({
    storage: multer.memoryStorage(), // Теперь используем memoryStorage для обработки Sharp
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, WEBP and PDF are allowed!'));
      }
    },
    limits: {
      fileSize: 25 * 1024 * 1024 // 25MB
    }
  }),

  mixed: multer({
    storage: multer.memoryStorage(), // Теперь используем memoryStorage для обработки Sharp
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, WEBP and PDF are allowed!'));
      }
    },
    limits: {
      fileSize: 25 * 1024 * 1024 // 25MB
    },
    
  }).fields([
    { name: 'images' },
    { name: 'size' },
  ]),


  // file: multer({ 
  //   storage: multer.diskStorage({
  //     destination: function (req, file, cb) {
  //       const uploadDir = './uploads/pdfs';
  //       if (!fs.existsSync(uploadDir)) {
  //         fs.mkdirSync(uploadDir, { recursive: true });
  //       }
  //       cb(null, uploadDir);
  //     },
  //     filename: function (req, file, cb) {
  //       // Генерируем уникальное имя файла: оригинальное имя + timestamp
  //       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  //       cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  //     },
  //     fileFilter: (req, file, cb) => {
  //       if (file.mimetype === 'application/pdf') {
  //         cb(null, true);
  //       } else {
  //         cb(new Error('Разрешена загрузка только PDF файлов'), false);
  //       }
  //     },
  //     limits: {
  //       fileSize: 25 * 1024 * 1024 // 25MB
  //     }
  //   }) 
  // })

}


