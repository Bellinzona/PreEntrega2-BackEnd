const {Router} = require("express")
const Products = require("../dao/dbManagers/products")
const productModel = require("../dao/models/products.model")

const manager = new Products()

const router = Router()

router.get("/", async (req, res) => {
    let limite = req.query.limit || 2;
    let pagina = req.query.page || 1;
    let des = req.query.sort === 'des' ? 1 : -1;
    let query = req.query.query;
  
    let filter = {};
    if (query) {
        
        filter.titulo = new RegExp(query, 'i');
    }

    let products = await productModel.paginate(filter, { limit: limite, page: pagina, sort: { precio: des }, lean: true });
    
    res.render("products", { docs: products.docs, pagina, rest:products });
    
});


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