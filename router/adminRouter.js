const Router = require('express').Router
const adminRouter = new Router()
const roleRouter = require('./roleRouter')
const adminController = require('../controllers/AdminController')
const CheckRoleMiddleware = require('../middleware/CheckRoleMiddleware')

adminRouter.post('/product/create', CheckRoleMiddleware(['admin', 'moderator']), adminController.createProduct)
adminRouter.post('/product/update', CheckRoleMiddleware(['admin', 'moderator']), adminController.updateProduct)
adminRouter.post('/product/delete', CheckRoleMiddleware(['admin', 'moderator']), adminController.deleteProduct)
adminRouter.post('/product/swap', CheckRoleMiddleware(['admin', 'moderator']), adminController.swapProduct)

adminRouter.post('/productGroup/create', CheckRoleMiddleware(['admin', 'moderator']), adminController.createProductSection)
adminRouter.post('/productGroup/update', CheckRoleMiddleware(['admin', 'moderator']), adminController.updateProductSection)
adminRouter.post('/productGroup/delete', CheckRoleMiddleware(['admin', 'moderator']), adminController.deleteProductSection)
adminRouter.post('/productGroup/swap', CheckRoleMiddleware(['admin', 'moderator']), adminController.swapProductSection)

adminRouter.post('/latestDevelopments/create', CheckRoleMiddleware(['admin', 'moderator']), adminController.createLatestDevelopments)
adminRouter.post('/latestDevelopments/delete', CheckRoleMiddleware(['admin', 'moderator']), adminController.deleteLatestDevelopments)

adminRouter.post('/partner/create', CheckRoleMiddleware(['admin', 'moderator']), adminController.createPartner)
adminRouter.post('/partner/update', CheckRoleMiddleware(['admin', 'moderator']), adminController.updatePartner)
adminRouter.post('/partner/delete', CheckRoleMiddleware(['admin', 'moderator']), adminController.deletePartner)

adminRouter.post('/certificate/create', CheckRoleMiddleware(['admin', 'moderator']), adminController.createCertificate)
adminRouter.post('/certificate/update', CheckRoleMiddleware(['admin', 'moderator']), adminController.updateCertificate)
adminRouter.post('/certificate/delete', CheckRoleMiddleware(['admin', 'moderator']), adminController.deleteCertificate)

adminRouter.post('/requisite/create', CheckRoleMiddleware(['admin', 'moderator']), adminController.createRequisite)
adminRouter.post('/requisite/update', CheckRoleMiddleware(['admin', 'moderator']), adminController.updateRequisite)
adminRouter.post('/requisite/delete', CheckRoleMiddleware(['admin', 'moderator']), adminController.deleteRequisite)

adminRouter.post('/unit/create', CheckRoleMiddleware(['admin', 'moderator']), adminController.createUnit)
adminRouter.post('/unit/update', CheckRoleMiddleware(['admin', 'moderator']), adminController.updateUnit)

// only admin 

adminRouter.post('/user/role/add', CheckRoleMiddleware(['admin']), adminController.addUserRole)
adminRouter.post('/user/role/delete', CheckRoleMiddleware(['admin']), adminController.deleteUserRole)
adminRouter.get('/user/role', CheckRoleMiddleware(['admin']), adminController.getRoles)
adminRouter.get('/user', CheckRoleMiddleware(['admin']), adminController.getUsers)

adminRouter.use('/role', CheckRoleMiddleware(['admin']), roleRouter)

// adminRouter.post('/contact/details', adminController.createOrUpdateContact)


module.exports = adminRouter