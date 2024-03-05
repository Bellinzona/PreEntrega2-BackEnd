const mongoose = require("mongoose")


const cartsSchema = new mongoose.Schema({


   productosCarrito: {
        type: Array,
        default: []
   }


})

const cartsModel = mongoose.model("carts", cartsSchema)


module.exports = cartsModel