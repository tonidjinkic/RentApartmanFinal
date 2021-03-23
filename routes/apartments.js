
var express = require("express");
var router  = express.Router();
var Apartment = require("../models/apartment");
var middleware = require("../middleware");
var open = require("open")
///////////////////////
var http = require("http")
var url = require("url")
var fs = require("fs")

//INDEX - show all apartments
router.get("/apartments", function(req, res){
    console.log('aaaaaaaaaaa')
    var noMatch = null;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Apartment.find({name: regex}, function(err, allApartments){
            if(err){
                console.log(err);
            } else {
                if(allApartments.length < 1) {
                    noMatch = "Nema apartmana sa takvim imenom,pokušajte ponovo"
                }
               res.render("apartments/index",{apartments:allApartments,noMatch:noMatch});
            }
         });
    }
    // Get all apartments from DB
    Apartment.find({}, function(err, allApartments){
       if(err){
           console.log(err);
       } else {
          res.render("apartments/index",{apartments:allApartments,noMatch:noMatch});
       }
    });
});

//CREATE - add new apartment to DB
router.post("/apartments", middleware.isLoggedIn, function(req, res){
    // get data from form and add to apartments array
    var name = req.body.name;
    var city = req.body.city;
    var image = req.body.image;
    var desc = req.body.description;
    var url = req.body.url;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newApartment = {name: name, city:city,url:url, image: image, description: desc, author:author}
    // Create a new apartment and save to DB
    Apartment.create(newApartment, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to apartments page
            console.log(newlyCreated);
            res.redirect("apartments");
        }
    });
});

//NEW - show form to create new apartment
router.get("/apartments/new", middleware.isLoggedIn, function(req, res){
   res.render("apartments/new");
});

// SHOW - shows more info about one apartment
router.get("/apartments/:id", function(req, res){
    //find the apartment with provided ID
    Apartment.findById(req.params.id).populate("comments").exec(function(err, foundApartment){
        if(err || !foundApartment){
            req.flash("error","Apartment not found");
            res.redirect("back")
        } else {
            console.log(foundApartment)
            //render show template with that apartment
            res.render("apartments/show", {apartment: foundApartment});
        }
    });
});

// EDIT apartment ROUTE
router.get("/apartments/:id/edit", middleware.checkApartmentOwnership, function(req, res){
    Apartment.findById(req.params.id, function(err, foundApartment){
        res.render("apartments/edit", {apartment: foundApartment});
    });
});

// UPDATE apartment ROUTE
router.put("/apartments/:id",middleware.checkApartmentOwnership, function(req, res){
    // find and update the correct apartment
    Apartment.findByIdAndUpdate(req.params.id, req.body.apartment, function(err, updatedApartment){
       if(err){
           res.redirect("/apartments");
       } else {
           //redirect somewhere(show page)
           res.redirect("/apartments/" + req.params.id);
       }
    });
});

// DESTROY apartments ROUTE
router.delete("/apartments/:id",middleware.checkApartmentOwnership, function(req, res){
   Apartment.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/apartments");
      } else {
          res.redirect("/apartments");
      }
   });
});

// zastita ddos napada

function escapeRegex(str) {
    return str.toString().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
