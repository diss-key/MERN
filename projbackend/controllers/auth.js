const User = require("../models/user");
const { use } = require("../routes/auth");
const { check, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');



exports.signup = (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0] .msg
        });
    }

    const user = new User(req.body)
    user.save((err, user) => {
        if(err) {
            return res.status(400).json({
                err  :"not able to save user in DB"
            });
        }
        res.json({
            name : user.name,
            email: user.email,
            id : user._id
        });
    });
};  

exports.signin = (req, res) => {
    
    const {email, password} = req.body; // destructuring of object

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0] .msg
        });
        
    }

    User.findOne({email}, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error : "User email doesn't exists"
            });
        }
        
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error : "email and pswd do not match"
            });
        }

        //create token
        const token = jwt.sign({_id: user._id}, process.env.SECRET)

        //inject token in cookies
        res.cookie("token", token, {expire : new Date() + 9999});

        //send response to front-end
        const {_id, name, email, role} = user;
        return res.json({token, user:{_id, name, email, role}});
    });
    
};



exports.signout = (req, res) =>{
    res.clearCookie("token");
    res.json({
        message: "user signed out successfully"
    });
};

//protected routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth",
    algorithms: ['HS256'] 
});



//custom middlewares
exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id //profile only set when user is logged in
    if (!checker) {
        return res.status(403).json({
            error : "ACCESS DENIED"
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0){
        return res.status(403).json({
            error: "You're not Admin, ACCESS DENIED"
        });
    }

    next();
};


