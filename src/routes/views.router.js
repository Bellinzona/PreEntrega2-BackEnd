const {Router} = require("express")
const productModel = require("../dao/models/products.model")
const producManager = require("../dao/dbManagers/products")


const productManager = new producManager()

const router = Router()


router.get("/", async (req,res) => {
    try {
        let pagina = req.query.page || 1;

        let des = req.query.sort === 'des' ? 1 : -1;
        

        const result = await productModel.paginate({}, { limit: 2, page: pagina, sort: { precio: des }, lean: true });

        console.log(result)
        res.render("products", { docs: result.docs, pagina, rest:result });
       
        
    } catch (error) {
        console.error('Error al obtener los productos:', error);
    }
});

router.get("/:id", async (req,res) => {
    let id = req.params.id

    const product = await productManager.getProductid(id)

    console.log(product)

    res.render("details", {product: product})
})




module.exports = router 