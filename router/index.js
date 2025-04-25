const Router = require('express').Router

const AuthMiddleware = require('../middleware/AuthMiddleware')
const userRouter = require("./userRouter")
const adminRouter = require('./adminRouter')
const CheckRoleMiddleware = require('../middleware/CheckRoleMiddleware')
const siteRouter = require('./siteRouter')
const router = new Router()

router.use('/user', userRouter)
router.use('/admin', AuthMiddleware, CheckRoleMiddleware(['admin', 'moderator']), adminRouter)
router.use('/site', siteRouter)

module.exports = router