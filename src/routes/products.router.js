const {Router} = require("express")
const Products = require("../dao/dbManagers/products")

const manager = new Products()

const router = Router()

router.get("/", async (req,res) => {
    let result = await manager.getAll()
    res.send({status : "success", result})
})

router.get("/:id", async (req,res) => {
    let productId = req.params.id

    let producto = await manager.getProductid(productId)

    res.send({status:"succes", producto})
})


router.post("/", async (req,res) => {

    if (!req.body.titulo || !req.body.descripcion || !req.body.precio || !req.body.codigo || !req.body.status || !req.body.stock   ) {
        res.send({status: "error"})
    } else {
        let result = await manager.saveProduct(req.body)
        res.send({status: "succes", result})

    }
    
})

router.put("/:id", async (req,res) => {

    try {
        const id = req.params.id 
        await manager.updateProduct(id,req.body)
        res.send({status:"succes"})

    } catch (error){
        res.send({status:"error"})
    }
    

    
})

router.delete("/:id", async (req,res) => {
    const id = req.params.id
    await manager.deleteProduct(id)

    res.send({status: "succes"})
}) 


module.exports = router 