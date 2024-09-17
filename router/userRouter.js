const Router = require('express').Router
const userController = require('../controllers/UserController')
const {body} = require('express-validator')
const AuthMiddleware = require('../middleware/AuthMiddleware')
const userRouter = new Router()


userRouter.post('/registration', 
    body('email').isEmail().withMessage('Такого email не существует'),
    body('password').isLength({min:6, max:20}).withMessage('Пароль должен содержать от 6 до 20 символов')
    .matches(/[a-zA-Z]/).withMessage('В пароле должны быть буквы')
    .matches(/[0-9]/).withMessage('В пароле должны быть цифры'), userController.registration)
    
userRouter.post('/login', 
    body('email').isEmail().withMessage('Такого email не существует'),
    body('password').isLength({min:6, max:20}).withMessage('Пароль должен содержать от 6 до 20 символов')
    .matches(/[a-zA-Z]/).withMessage('В пароле должны быть буквы')
    .matches(/[0-9]/).withMessage('В пароле должны быть цифры'), userController.login)

userRouter.get('/refresh', userController.refresh)
userRouter.get('/logout', userController.logout)
userRouter.get('/check', AuthMiddleware, userController.checkAuth)

module.exports = userRouter