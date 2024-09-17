const AuthError = require("../error/AuthError");
const { User, Role } = require("../models/models");


// Обязательно до этого должен быть AuthMiddleware

module.exports = function(roles){
    return async function(req, res, next){
        const user = req.user;
        if(!user) return next(AuthError.UnauthorizedError())
        const userData = await User.findOne({where: {email: user.email}, include: Role})
        const userRoles = userData.roles.map(role => role.value)
        let thereIsAccess = false;
        userRoles.map(role => {
            if(roles.includes(role)) thereIsAccess = true
        })
        if(!thereIsAccess) return next(AuthError.forbidden('Нет прав'))
        next()
    }
}