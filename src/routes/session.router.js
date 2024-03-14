const {Router} = require('express');
const userModel = require('../dao/models/user.model');

const sessionRouter = Router();

sessionRouter.post('/register',  async (req, res)=>{
    const { first_name, last_name, email, age,password} = req.body; 

    if(!first_name || !last_name || !email || !age || !password){
        return res.status(400).send({status: 'error', error:'Missing data'})
    }

    const result = await userModel.create({first_name, last_name, email, age,password})
    res.send({status: 'success', mesage: 'user registered'})
})


sessionRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;



    if (email === "admin@gmail.com" && password === "admin123") {
        // Redirige al usuario administrador a la página de administrador
        return res.status(500).send({ status: 'Admin', error: 'Admin acces' });
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

    res.send({
        status: 'success',
        payload: req.session.user,
        message: 'Successfully logged in',
        redirect: '/profile'
    });
});



sessionRouter.get('/logout',(req, res)=>{
    req.session.destroy((err)=>{
        if(err) return res.status(500).send('there was an error destroying session')
    })
    res.redirect('/login')
})




module.exports = sessionRouter;