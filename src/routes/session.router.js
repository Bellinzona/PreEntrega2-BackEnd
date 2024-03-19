const {Router} = require('express');
const userModel = require('../dao/models/user.model');
const {JWT_SECRET,initializePassport} = require("../public/config/passport.confg")
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const passport = require('passport');

const sessionRouter = Router();


sessionRouter.get("/github", passport.authenticate("github",{scope:["user:email"]}), async(req,res) => {})

sessionRouter.get("/githubcallback", passport.authenticate("github", {failureRedirect:"/login"}), async (req,res) => {
    req.session.user = req.user
    res.redirect("/")
})

sessionRouter.post('/register',  async (req, res)=>{
    const { first_name, last_name, email, age,password} = req.body; 

    if(!first_name || !last_name || !email || !age || !password){
        return res.status(400).send({status: 'error', error:'Missing data'})
    }

    const result = await userModel.create({first_name, last_name, email, age,password})
    
    const token = jwt.sign({email, password, role: "user" }, JWT_SECRET, {expiresIn:'24h'})
    res.cookie('coderCookie',token,{httpOnly: true }).send({status:'success',payload: req.session.user, message:'successfuly logged in'})
})


sessionRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;



    if (email === "admin@gmail.com" && password === "admin123") {
        
        const token = jwt.sign({email, password, role: "admin" }, JWT_SECRET, {expiresIn:'24h'})
        res.cookie('coderCookie',token,{httpOnly: true }).send({status:'success',payload: req.session.user, message:'successfuly logged in'})
        return res.status(500)
        
    }

    if (!email || !password) {
        console.log("mal");
        return res.status(400).send({ status: 'error', error: 'Missing data' });
    }

    const user = await userModel.findOne({ email, password });
    if (!user) {
        console.log("mal");
        return res.status(401).send({ status: 'error', error: 'Incorrect credentials' });
    }

    

    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age
    }


    const token = jwt.sign({email, password, role: "user"}, JWT_SECRET, {expiresIn:'24h'})
    res.cookie('coderCookie',token,{httpOnly: true }).send({status:'success',payload: req.session.user, message:'successfuly logged in'})
});



sessionRouter.get('/logout',(req, res)=>{
    req.session.destroy((err)=>{
        if(err) return res.status(500).send('there was an error destroying session')
    })
    res.redirect('/login')
})




module.exports = sessionRouter;