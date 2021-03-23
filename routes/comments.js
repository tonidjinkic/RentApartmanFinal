
var express = require("express");
var router  = express.Router({mergeParams: true});
var Apartment = require("../models/apartment");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/apartments/:id/comments/new",middleware.isLoggedIn, function(req, res){
    // find apartment by id
    Apartment.findById(req.params.id, function(err, apartment){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {apartment: apartment});
        }
    })
});

//Comments Create
router.post("/apartments/:id/comments",middleware.isLoggedIn,function(req, res){
   //lookup apartment using ID
   Apartment.findById(req.params.id, function(err, apartment){
       if(err){
           console.log(err);
           res.redirect("/RentApartman/apartments");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error","Upps, došli smo do greške")
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               apartment.comments.push(comment);
               apartment.save();
               console.log(comment);
               req.flash("success","Uspješno dodan komentar")
               res.redirect('/RentApartman/apartments/' + apartment._id);
           }
        });
       }
   });
});

// COMMENT EDIT ROUTE
router.get("/apartments/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Apartment.findById(req.params.id,function(err,foundApartment){
        if(err || !foundApartment){
            req.flash("error","No Apartment found")
            return res.redirect("back")
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
              res.render("comments/edit", {apartment_id: req.params.id, comment: foundComment});
            }
         });
    })
});

// COMMENT UPDATE
router.put("/apartments/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("apartments/" + req.params.id );
      }
   });
});

// COMMENT DESTROY ROUTE
router.delete("/apartments/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success","Komentar izbrisan !!")
           res.redirect("/apartments/" + req.params.id);
       }
    });
});

module.exports = router;

