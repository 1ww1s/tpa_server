const Router = require('express').Router
const roleRouter = new Router()
const adminController = require('../controllers/AdminController')

roleRouter.post('/create', adminController.createRole)

module.exports = roleRouter