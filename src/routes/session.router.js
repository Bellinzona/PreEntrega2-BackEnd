const {Router} = require('express');
const userModel = require('../dao/models/user.model');
const {JWT_SECRET,initializePassport} = require("../dao/passport.confg")
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const bcrypt = require("bcrypt")

const sessionRouter = Router();


sessionRouter.get("/github", passport.authenticate("github",{scope:["user:email"]}), async(req,res) => {})

sessionRouter.get("/githubcallback", passport.authenticate("github", {failureRedirect:"/login"}), async (req,res) => {
    req.session.user = req.user
    res.redirect("/")
})

sessionRouter.post("/register", passport.authenticate("register", {
    session: false,
    failureRedirect: "/login"
}), (req, res) => {
    res.send({ status: "success" });
});


sessionRouter.post("/login", passport.authenticate("login", {
    session: false,
    failureRedirect: "/login"
}), (req, res) => {
    const { _id, first_name, last_name, email, age, password } = req.user;
    const serializeUser = {
        _id,
        first_name,
        last_name,
        email,
        age,
        password
    };
    
    const token = jwt.sign(serializeUser,"tokenSecret",{expiresIn:"1h"})

    
    res.cookie("coderCookie", token, {maxAge:60 * 60 * 1000})
    console.log("entro")
    res.send({status:"succes", message:"se inicio sesion", payload:token})
});





sessionRouter.get('/logout',(req, res)=>{
    req.session.destroy((err)=>{
        if(err) return res.status(500).send('there was an error destroying session')
    })
    res.redirect('/login')
})




module.exports = sessionRouter;