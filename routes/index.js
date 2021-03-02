var express = require("express")
var router = express.Router();
// passport i User nije definiran pa cemo morat importat Usera i passporta
var passport = require("passport");
var User = require("../models/user");

//ROOT ROUTE
router.get("/RentApartman", function(req, res){
    res.render("landing");
});

router.get("/RentApartman/aboutUs",function(req,res){
    res.render("aboutus")
})
///////////////////////////
// AUTH ROUTES
//////////////////////

/// show register form 
router.get("/RentApartman/register",function(req,res){
    res.render("register");
})
//sign up logic
router.post("/RentApartman/register",function(req,res){
    var newUser = new User({username:req.body.username});
    //eval(require('locus'))
    if(req.body.adminCode === "secretcode123"){
        newUser.isAdmin = true;
    }
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            req.flash("error",err.message)
            return res.render("register")
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success","Dobrodošli u RentApartman " +user.username)
            res.redirect("/RentApartman/apartments")
        });
    });
});

//show login form
router.get("/RentApartman/login",function(req,res){  
    res.render("login"); 
})
// handling login logic i logira i middleware,ovo usredini  
router.post("/RentApartman/login",passport.authenticate("local",
    {
        successRedirect:"/RentApartman/apartments", 
        failureRedirect:"/login"
    }),function(req,res){ 
}) 
// logout route
router.get("/RentApartman/logout",function(req,res){ 
    req.logout();
    req.flash("success","Uspješno ste se odjavili") 
    res.redirect("/RentApartman/apartments");
})

module.exports=router;
