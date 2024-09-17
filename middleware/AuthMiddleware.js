const AuthError = require("../error/AuthError");
const jwt = require('jsonwebtoken');
const tokenService = require("../service/TokenService");

module.exports = async function(req, res, next){
    const authorization = req.headers.authorization;
    if(!authorization) return next(AuthError.UnauthorizedError())
    const token = authorization.split(' ')[1];
    if(!token) return next(AuthError.UnauthorizedError())
    const user = await tokenService.validateAccessToken(token)
    if(!user) return next(AuthError.UnauthorizedError())
    req.user = user;
    next()
}