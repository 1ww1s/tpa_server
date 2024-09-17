const Router = require('express').Router
const adminController = require('../controllers/AdminController')

const productRouter = new Router()

productRouter.post('/create', adminController.createProduct)



module.exports = productRouter