const cartsModel = require("../models/carts.model")


class carts {
    constructor() {

    }

    async getAll(){
        const carts = await cartsModel.find().lean()
        return carts
    }

    async getCartId(id){
        const cart = await cartsModel.findOne({_id: id})
        return cart
    }


    async saveCart(aaa){
        let nuevoCarrito = await cartsModel.create(aaa)
        console.log(nuevoCarrito)
        return nuevoCarrito
    }

    async saveProductInCart(product, cartId) {
        // Obtener el carrito existente
        let cart = await this.getCartId(cartId);
    
        const existingProduct = cart.productosCarrito.find(p => p.titulo === product.titulo);
    
        if (existingProduct) {
            existingProduct.cantidad++;
        } else {
            cart.productosCarrito.push({ ...product, cantidad: 1 });
        }
    
        const updatedCart = await cartsModel.findOneAndUpdate({ _id: cartId }, cart, { new: true });
    
        return updatedCart;
    }

    async deleteCart(id){
        await cartsModel.deleteOne({_id: id})

    }

    async deleteProductInCart(product, cartId) {
        let cart = await this.getCartId(cartId);
    
        const index = cart.productosCarrito.findIndex(p => p.titulo === product.titulo);
    
        if (index !== -1 && cart.productosCarrito[index].cantidad === 1) {
            cart.productosCarrito.splice(index, 1);
        } else if (index !== -1) {
            cart.productosCarrito[index].cantidad--;
        }
    
        const updatedCart = await cartsModel.findOneAndUpdate({ _id: cartId }, cart, { new: true });
    
        return updatedCart;
    }


    async actualizarCantidad(product, cartId, cantidad){

        let cart = await this.getCartId(cartId)

        const producto = cart.productosCarrito.find(p => p.titulo === product.titulo)

        if (producto){
            producto.cantidad = cantidad
        }

        const updatedCart = await cartsModel.findOneAndUpdate({_id: cartId}, cart, {new:true})

        return updatedCart

    }


    async borrarProductosCarrito(cartId){

        let cart = await this.getCartId(cartId)

        cart.productosCarrito = []

        const updatedCart = await cartsModel.findOneAndUpdate({_id: cartId}, cart, {new:true})

        return updatedCart

        


    }
    
    
    
}




module.exports = carts