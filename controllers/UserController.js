const { validationResult } = require('express-validator');
const userService = require('../service/UserService');
const AuthError = require('../error/AuthError');

const cookieOptions = {
    maxAge: 1 * 365 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
}

class UserController{

    async registration(req, res, next){
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return next(AuthError.BadRequest(errors.array()[0].msg))
            }
            const {email, password} = req.body;
            const data = await userService.registration(email, password)
            res.cookie('token', data.refreshToken, cookieOptions)
            res.cookie('token_access', data.accessToken, cookieOptions)
            return res.json({user: data.user, accessToken: data.accessToken})
        }
        catch(e){
            next(e)
        }
    }

    async login(req, res, next){
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return next(AuthError.BadRequest(errors.array()[0].msg))
            }
            const {email, password} = req.body;
            const data = await userService.login(email, password)
            res.cookie('token', data.refreshToken, cookieOptions)
            res.cookie('token_access', data.accessToken, cookieOptions)
            return res.json({user: data.user, accessToken: data.accessToken})
        }
        catch(e){
            next(e)
        }
    }
    
    async refresh(req, res, next){
        try {
            const token = req.cookies.token
            const data = await userService.refresh(token)
            res.cookie('token', data.refreshToken, cookieOptions)
            res.cookie('token_access', data.accessToken, cookieOptions)
            return res.json({user: data.user, accessToken: data.accessToken})
        }
        catch(e){
            next(e)
        }
    }

    async checkAuth(req, res, next){
        try{
            if(!req.user.email) throw RequestError.BadRequest('Не указан email')
            const user = await userService.checkAuth(req.user.email)
            return res.json(user)
        }
        catch(e){
            next(e)
        }
    }

  
    async logout(req, res, next){
        try {
            const refreshToken = req.cookies.token
            await userService.logout(refreshToken)
            res.clearCookie('token')
            return res.status(200).json({message:"logout"})
        }
        catch(e) {
            next(e)
        }
    }

}

module.exports = new UserController()