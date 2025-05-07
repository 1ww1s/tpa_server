const Router = require('express').Router
const siteController = require('../controllers/SiteController')

const siteRouter = Router()

siteRouter.get('/product/data/:slug', siteController.getProduct)
siteRouter.get('/product/images/:slug', siteController.getProductImages)
siteRouter.get('/product/name/:slug', siteController.getProductNameBySlug)
siteRouter.get('/product/arrayByName/:name', siteController.getProductsByName)
siteRouter.get('/product/itemNames', siteController.getProductItemNames)
siteRouter.get('/product/itemsByProduct/:slug', siteController.getProductItemsOfGroup)
siteRouter.get('/product/itemsByGroup/:slug', siteController.getProductItemsByGroup)

siteRouter.get('/contact', siteController.getContact)

siteRouter.get('/unit', siteController.getUnit)
siteRouter.get('/unit/:value', siteController.getUnitsByValue)

siteRouter.get('/productGroup/names', siteController.getGroupNames)
siteRouter.get('/productGroup/itemNames', siteController.getGroupItemNames)
siteRouter.get('/productGroup', siteController.getGroupAll)
siteRouter.get('/productGroup/name/:slug', siteController.getGroupNameBySlug)
siteRouter.get('/productGroup/data/:slug', siteController.getGroupBySlug)
siteRouter.get('/productGroup/arrayByTitle/:title', siteController.getGroupByTitle)

siteRouter.post('/informationDisclosure/arrayByName', siteController.getInformationDisclosureStartsWith)
siteRouter.post('/informationDisclosure/name', siteController.getInformationDisclosureByName)
siteRouter.get('/informationDisclosure/getAll', siteController.getAllInformationDisclosure)

siteRouter.get('/certificates', siteController.getCertificates)

siteRouter.get('/partners/', siteController.getPartners)
siteRouter.get('/partners/names', siteController.getPartnersNames)

siteRouter.get('/productPreviews/:slug', siteController.getProductPreviews)
siteRouter.get('/productPreview/:slug', siteController.getProductPreview)

siteRouter.get('/latestDevelopments', siteController.getLatestDevelopments)
siteRouter.post('/latestDevelopment', siteController.getLatestDevelopment)
siteRouter.get('/latestDevelopments/items', siteController.getLatestDevelopmentsItems)

siteRouter.get('/requisite', siteController.getRequisites)

module.exports = siteRouter