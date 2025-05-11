const Router = require('express').Router
const express = require('express');
const AuthMiddleware = require('../middleware/AuthMiddleware')
const userRouter = require("./userRouter")
const adminRouter = require('./adminRouter')
const CheckRoleMiddleware = require('../middleware/CheckRoleMiddleware')
const siteRouter = require('./siteRouter')
const path = require('path')
const router = new Router()

router.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
    maxAge: '10m',
    setHeaders: (res) => {
      res.set('Cache-Control', 'public, max-age=600');
    }
}));


router.use('/user', userRouter)
router.use('/admin', AuthMiddleware, CheckRoleMiddleware(['admin', 'moderator']), adminRouter)
router.use('/site', siteRouter)

module.exports = router