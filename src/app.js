const express = require("express")
const mongoose = require("mongoose")
const handlebars = require("express-handlebars")
const app = express()

const productRouter = require("./routes/products.router")
const cartsRouter = require("./routes/carts.router")
const viewsRouter = require("./routes/views.router")

const port = 8080

mongoose.connect("mongodb+srv://mtbellinzona:NNCrtzeP4pkmXAlR@cluster0.8vsrtxc.mongodb.net/ecommerce").then(() => {   // para especificar la base de datos que queres usa
                                                                                                             //  tenes que poner el nombre de la db despues del /
    console.log("conectado")
})


app.engine("handlebars", handlebars.engine())
app.set("views",`${__dirname}/views`)
app.set("view engine", "handlebars")


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(`${__dirname}/public`))


app.listen(port, () => {
    console.log("server ON")
})


app.use("/api/products", productRouter )
app.use("/api/carts", cartsRouter )
app.use("/api/views", viewsRouter )
