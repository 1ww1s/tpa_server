const Router = require('express').Router
const adminRouter = new Router()
const roleRouter = require('./roleRouter')
const adminController = require('../controllers/AdminController')
const CheckRoleMiddleware = require('../middleware/CheckRoleMiddleware')
const upload = require('../config/multer.config');

adminRouter.post('/product/create', upload.mixed, adminController.createProduct)
adminRouter.post('/product/update', upload.mixed, adminController.updateProduct)
adminRouter.post('/product/updateOptions', adminController.updateProductOptions)
adminRouter.post('/product/delete', adminController.deleteProduct)
adminRouter.post('/product/swap', adminController.swapProduct)

adminRouter.post('/productGroup/create', upload.image.single('image'), adminController.createProductSection)
adminRouter.post('/productGroup/update', upload.image.single('image'), adminController.updateProductSection)
adminRouter.post('/productGroup/delete', adminController.deleteProductSection)
adminRouter.post('/productGroup/swap', adminController.swapProductSection)

adminRouter.post('/latestDevelopments/create', upload.image.single('image'), adminController.createLatestDevelopments)
adminRouter.post('/latestDevelopments/delete', adminController.deleteLatestDevelopments)

adminRouter.post('/partner/create', adminController.createPartner)
adminRouter.post('/partner/update', adminController.updatePartner)
adminRouter.post('/partner/delete', adminController.deletePartner)

adminRouter.post('/certificate/create', upload.image.single('image'), adminController.createCertificate)
adminRouter.post('/certificate/update', upload.image.single('image'), adminController.updateCertificate)
adminRouter.post('/certificate/delete', adminController.deleteCertificate)

adminRouter.post('/requisite/create', adminController.createRequisite)
adminRouter.post('/requisite/update', adminController.updateRequisite)
adminRouter.post('/requisite/delete', adminController.deleteRequisite)
adminRouter.post('/companyCard/update', upload.image.single('file'), adminController.updateCompanyCard)

adminRouter.post('/unit/create', adminController.createUnit)
adminRouter.post('/unit/update', adminController.updateUnit)

adminRouter.post('/informationDisclosure/create', upload.image.array('pdfFiles'), adminController.createInformationDisclosure)
adminRouter.post('/informationDisclosure/update', upload.image.array('pdfFiles'), adminController.updateInformationDisclosure)
adminRouter.post('/informationDisclosure/delete', adminController.deleteInformationDisclosure)

// only admin 

adminRouter.post('/user/role/add', CheckRoleMiddleware(['admin']), adminController.addUserRole)
adminRouter.post('/user/role/delete', CheckRoleMiddleware(['admin']), adminController.deleteUserRole)
adminRouter.get('/user/role', CheckRoleMiddleware(['admin']), adminController.getRoles)
adminRouter.get('/user', CheckRoleMiddleware(['admin']), adminController.getUsers)

adminRouter.use('/role', CheckRoleMiddleware(['admin']), roleRouter)

// adminRouter.post('/contact/details', adminController.createOrUpdateContact)


module.exports = adminRouter