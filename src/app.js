const express = require("express")
const mongoose = require("mongoose")
const handlebars = require("express-handlebars")
const app = express()
const session = require('express-session');
const MongoStore = require('connect-mongo');
const jwt = require('jsonwebtoken');
const passport = require('passport');


const productRouter = require("./routes/products.router")
const cartsRouter = require("./routes/carts.router")
const viewsRouter = require("./routes/views.router")
const usuariosRouter = require("./routes/usuarios.router")
const sessionRouter = require("./routes/session.router");
const { initializePassport, initializeGit } = require("./public/config/passport.confg");

const port = 8080

mongoose.connect("mongodb+srv://mtbellinzona:NNCrtzeP4pkmXAlR@cluster0.8vsrtxc.mongodb.net/ecommerce").then(() => {   // para especificar la base de datos que queres usa
                                                                                                             //  tenes que poner el nombre de la db despues del /
    console.log("conectado")
})


app.use(session({
    secret:'ourNewSecret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: `mongodb+srv://mtbellinzona:NNCrtzeP4pkmXAlR@cluster0.8vsrtxc.mongodb.net/login`,
        ttl: 3600
    })
}))


app.engine("handlebars", handlebars.engine())
app.set("views",`${__dirname}/views`)
app.set("view engine", "handlebars")


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(`${__dirname}/public`))
app.use(passport.initialize());
initializeGit()


app.listen(port, () => {
    console.log("server ON")
})


app.use("/api/products", productRouter )
app.use("/api/carts", cartsRouter )
app.use("/api/views", viewsRouter )
app.use("/",usuariosRouter)
app.use('/api/sessions',sessionRouter)
