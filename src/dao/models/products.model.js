const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")


const productSchema = new mongoose.Schema({


    titulo: {
        type: String,
        default:"milanesa"
    },

    descripcion: {
        type: String,
        default:"milanesa de pollo lista para cocinar"
    },

    precio: {
        type: Number,
        default:"5000"
    },

    codigo: {
        type: String,
        default: "aet341"
    },
    status:{
        type: Boolean,
        default: true
    },
    stock:{
        type: Number,
        default: 10
    }



})

productSchema.plugin(mongoosePaginate)

const productModel = mongoose.model("products", productSchema)


module.exports = productModel