const productModel = require("../models/products.model")


class Products {
    constructor(){

    }


    async getAll(){
        let products = await productModel.find().lean()
        return products
    }

    async getProductid(id){
        let product = await productModel.find({_id:id}).lean()
        return product[0]
    }

    async saveProduct(product){
        let result = await productModel.create(product)
        return result
    }

    async updateProduct(id,newItem){
        await productModel.updateOne({_id: id}, newItem)
    }

    async deleteProduct (id) {
        await productModel.deleteOne({_id:id})
    }
}




module.exports = Products