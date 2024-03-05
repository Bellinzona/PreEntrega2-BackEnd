const {Router} = require("express")
const Carts = require("../dao/dbManagers/carts")
const Products = require("../dao/dbManagers/products")



const manager = new Carts()
const managerProducts = new Products()

const router = Router()



router.get("/", async (req,res) => {
    let carts = await manager.getAll()
    res.send({status:"succes", carts})
})


router.post("/", async (req,res) => {
    let carritoCreado = await manager.saveCart(req.body)
    res.send({status: "succes", carritoCreado})
    
})


router.post("/:idProduct/enCarrito/:idCarrito", async (req,res) => {
    let idProduct = req.params.idProduct
    let idCarrito = req.params.idCarrito

    let producto = await managerProducts.getProductid(idProduct)

    carritoActualizado = await manager.saveProductInCart(producto,idCarrito)

    res.send({status:"succes", carritoActualizado})

})

router.delete("/:id", async (req,res) => {
    let idCarrito = req.params.id

    await manager.deleteCart(idCarrito)

    res.send({status: "succes"})

})


router.delete("/:idProduct/enCarrito/:idCarrito", async (req,res) => {
    let idProduct = req.params.idProduct
    let idCarrito = req.params.idCarrito

    let producto = await managerProducts.getProductid(idProduct)

    carritoActualizado = await manager.deleteProductInCart(producto,idCarrito)

    res.send({status:"succes", carritoActualizado})



})


router.put("/:idProduct/enCarrito/:idCarrito", async (req,res) => {
    let idProduct = req.params.idProduct
    let idCarrito = req.params.idCarrito

    let producto = await managerProducts.getProductid(idProduct)

    let productoActualizado = await manager.actualizarCantidad(producto,idCarrito,req.body)

    res.send({status: "succes", productoActualizado})


})

router.delete("/borrarProductos/:idCarrito", async (req,res) => {
    let idCarrito = req.params.idCarrito

    let carritoActualizado = await manager.borrarProductosCarrito(idCarrito)

    res.send({status: "succes", carritoActualizado})


})


module.exports = router 