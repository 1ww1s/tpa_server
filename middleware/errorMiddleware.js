const AuthError = require("../error/AuthError")
const DataBase = require("../error/DataBaseError")
const RequestError = require("../error/RequestError")


module.exports = function(err, req, res, next){
    if(err instanceof AuthError) {
        return res.status(err.status).json({message: err.message})
    }
    if(err instanceof DataBase){
        console.log(err.message)
        return res.status(err.status).json({message: err.message})
    }
    if(err instanceof RequestError){
        return res.status(err.status).json({message: err.message})
    }
    console.log(err)
    return res.status(500).json({message: 'Непредвиденная ошибка'})
} 