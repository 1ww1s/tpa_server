const productService = require("./ProductService")


class SiteService{

    async getProduct(slug){
        const productData = await productService.get(slug)
        return productData
    }
}


module.exports = new SiteService()