module.exports = class AuthError extends Error {
    constructor(status, message){
        super()
        this.message = message
        this.status = status
    }
    static BadRequest(message) {
        return new AuthError(400, message)
    }

    static UnauthorizedError(){
        return new AuthError(401, 'Пользователь не авторизован')
    }
    
    static forbidden(message){
        return new AuthError(403, message)
    }

    static Conflict(message){
        return new AuthError(409, message)
    }

    static UnprocessableEntity(message){
        return new AuthError(422, message)
    }
}