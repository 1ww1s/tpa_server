module.exports = class TokenDto{
    email
    role

    constructor(model){
        this.email = model.email
        this.roles = model.roles.map(role => role.value)
    }
}