const { DataTypes } = require('sequelize')
const sequelize = require('../db')


const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
})

const Role = sequelize.define('role', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    value: {type: DataTypes.STRING, unique: true}
})

const RefreshToken = sequelize.define('token', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    token: {type: DataTypes.STRING},
})

const Requisite = sequelize.define('requisite', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true},
    value: {type: DataTypes.STRING}
})

const ProductSection = sequelize.define('productSection', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, unique: true},
    slug: {type: DataTypes.STRING},
    index: {type: DataTypes.INTEGER},
})

const Product = sequelize.define('product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true},
    slug: {type: DataTypes.STRING},
    index: {type: DataTypes.INTEGER},
})

const Image = sequelize.define('image', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    value: {type: DataTypes.TEXT},
    index: {type: DataTypes.INTEGER},
})

const Certificate = sequelize.define('certificate', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    img: {type: DataTypes.TEXT},
    endDate: {type: DataTypes.STRING}
})

const Partner = sequelize.define('partner', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    img: {type: DataTypes.TEXT},
})

const LatestDevelopment = sequelize.define('latestDevelopment', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const DeliverySet = sequelize.define('deliverySet', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    numb: {type: DataTypes.STRING},
    note: {type: DataTypes.TEXT},
})

const Modification = sequelize.define('modification', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    diesel: {type: DataTypes.STRING},
    note: {type: DataTypes.TEXT},
})

const TechCharacteristic = sequelize.define('techCharacteristic', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
})

const Item = sequelize.define('item', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
})

const TechCharacteristicItem = sequelize.define('techCharacteristic_item', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    value: {type: DataTypes.STRING},
}) 

const Unit = sequelize.define('unit', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    value: {type: DataTypes.STRING, unique: true},
})


const Function = sequelize.define('function', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    value: {type: DataTypes.TEXT},
})

const Contact = sequelize.define('contact', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.TEXT},
    telephone: {type: DataTypes.TEXT},
    address: {type: DataTypes.TEXT},
    openingHours: {type: DataTypes.TEXT},
})

const MonAndIndParam = sequelize.define('monAndIndParam', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    value: {type: DataTypes.TEXT},
})

const Info = sequelize.define('info', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    value: {type: DataTypes.TEXT},
})

const UserRole = sequelize.define('user_role', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})


User.hasOne(RefreshToken)
RefreshToken.belongsTo(User)

User.belongsToMany(Role, {through: UserRole})
Role.belongsToMany(User, {through: UserRole})

ProductSection.hasMany(Product, {onDelete: 'CASCADE'})
Product.belongsTo(ProductSection)

ProductSection.hasOne(Image, {onDelete: 'CASCADE'})
Image.belongsTo(ProductSection)

ProductSection.hasOne(Info, {onDelete: 'CASCADE'})
Info.belongsTo(ProductSection)

Product.hasOne(Info, {onDelete: 'CASCADE'})
Info.belongsTo(Product)

Product.hasMany(DeliverySet, {onDelete: 'CASCADE'})
DeliverySet.belongsTo(Product)

Product.hasOne(LatestDevelopment, {onDelete: 'CASCADE'})
LatestDevelopment.belongsTo(Product)

Product.hasMany(Modification, {onDelete: 'CASCADE'})
Modification.belongsTo(Product)

Product.hasMany(Image, {onDelete: 'CASCADE'})
Image.belongsTo(Product)

Product.hasMany(TechCharacteristic, {onDelete: 'CASCADE'})
TechCharacteristic.belongsTo(Product)

Unit.hasMany(TechCharacteristic)
TechCharacteristic.belongsTo(Unit)

Product.hasMany(Item, {onDelete: 'CASCADE'})
Item.belongsTo(Product)

TechCharacteristic.belongsToMany(Item, {through: TechCharacteristicItem, onDelete: 'CASCADE'})
Item.belongsToMany(TechCharacteristic, {through: TechCharacteristicItem, onDelete: 'CASCADE'})

Product.hasMany(Function, {onDelete: 'CASCADE'})
Function.belongsTo(Product)

Product.hasMany(MonAndIndParam, {onDelete: 'CASCADE'})
MonAndIndParam.belongsTo(Product)


module.exports = {
    Requisite,
    Certificate,
    User,
    Role, 
    UserRole,
    RefreshToken,
    ProductSection,
    Product, 
    DeliverySet, 
    Modification,
    TechCharacteristic,
    Function,
    MonAndIndParam,
    Info,
    Image,
    TechCharacteristicItem,
    Unit,
    Item,
    Contact,
    Partner,
    LatestDevelopment
}