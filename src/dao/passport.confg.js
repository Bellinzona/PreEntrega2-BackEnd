const passport = require('passport');
const password = require('passport')
const jwt = require('passport-jwt');
const gitthubStrategy = require("passport-github2")
const userModel = require('./models/user.model');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');


const JWT_SECRET = 'ourSecret'; 



const initializePassport = () => {
    // JWT Strategy
    password.use('jwt', new jwt.Strategy({
        secretOrKey: JWT_SECRET, 
        jwtFromRequest: jwt.ExtractJwt.fromExtractors([cookieExtractor])
    },(jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            console.log("aaa")
            return done(error)
        }
    }));

    // Local Strategy
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const user = await userModel.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect password.' });
            }
        } catch (error) {
            return done(error);
        }
    }));
};


const initializeGit = () => {
    passport.use("github", new gitthubStrategy({
        clientID: "Iv1.d0d6500cdb05647a",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
        clientSecret: "1c18f6bb4ade0dcead68023ca7e4b34144994c93"
    },  async (_accessToken,_refreshToken,profile,done) => {
        try{

            const user = await userModel.findOne({email: profile._json.email})

            if(!user){
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    email: profile._json.email,
                    age: null,
        

                }
                let result = await userModel.create(newUser)
                return done(null,result)

            }else{
                return done(null,user)
            }
            done(null,false)

        }
        catch(error){
            return done(error)

        }
        
    }))

}

passport.serializeUser((user,done) => {
    done(null,user._id)
})

passport.deserializeUser( async (userid,done) => {
    let user = await userModel.findOne({_id:userid})
    done(null,user)
})

function cookieExtractor(req){
    let token = null;
    if(req.cookies.coderCookie){
        token = req.cookies.coderCookie;
    }

    return token; 
}


module.exports = {
    initializePassport,
    JWT_SECRET,
    initializeGit
}; 