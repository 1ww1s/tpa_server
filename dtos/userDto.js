module.exports = class UserDto{
    email
    roles

    constructor(model){
        this.email = model.email
        this.roles = model.roles.map(role => role.value)
    }
}