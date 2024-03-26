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

sessionRouter.post('/register', async (req, res)=>{
    const { first_name, last_name, email, age, password } = req.body; 

    if(!first_name || !last_name || !email || !age || !password){
        return res.status(400).send({status: 'error', error:'Missing data'})
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await userModel.create({first_name, last_name, email, age, password: hashedPassword})
    
    const token = jwt.sign({ email, password: hashedPassword, role: "user" }, JWT_SECRET, {expiresIn:'24h'})
    res.cookie('coderCookie', token, { httpOnly: true }).send({status:'success', payload: req.session.user, message:'successfully logged in'})
})

sessionRouter.post('/login', async (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
        if (err) { 
            return next(err); 
        }
        if (!user) { 
            return res.status(401).send({ status: 'error', error: 'Incorrect credentials' });
        }

        req.logIn(user, async (err) => {
            if (err) { 
                return next(err); 
            }

            const token = jwt.sign({ email: user.email, role: "user" }, JWT_SECRET, { expiresIn: '24h' });
            res.cookie('coderCookie', token, { httpOnly: true });

            // Redirigir al usuario a la ruta /profile
            console.log("entro")
        });
    })(req, res, next);
});





sessionRouter.get('/logout',(req, res)=>{
    req.session.destroy((err)=>{
        if(err) return res.status(500).send('there was an error destroying session')
    })
    res.redirect('/login')
})




module.exports = sessionRouter;