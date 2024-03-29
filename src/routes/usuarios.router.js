const {Router} = require("express")
const passport = require('passport');


const router = Router()

const publicAccess = (req, res, next)=>{
    if(req.session.user) return res.redirect('/')
    next();
}

const privateAccess = (req, res, next)=>{
    if(!req.session.user) {
        console.log("not logged in")
        return res.redirect('/login')
    }
    next();
}

router.get('/register', publicAccess, (req, res)=>{
    res.render('register',{})
})

router.get('/login', publicAccess, (req,res)=>{
    res.render('login')
})

router.get('/admin', publicAccess, (req,res)=>{
    res.render("admin")
})

router.get("/current", passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.headers.authorization);  // Imprime el encabezado de autorización
    console.log(req.user);  // Imprime los datos del usuario autenticado
    res.json({ user: req.user });
});

router.get('/', privateAccess, (req,res)=>{
    res.render('profile',{user: req.session.user})
})



module.exports = router 