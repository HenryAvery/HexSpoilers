const Card    = require("../models/card"),
      Comment = require("../models/comment");

module.exports = {
    
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("/login");
    },
    
    checkCardOwner: function(req, res, next){
            Card.findById(req.params.id, (err, foundCard) => {
                if(err){
                    req.flash("error", "Card not found.");
                    res.redirect("back");
                }else{
                    if(foundCard.author.id.equals(req.user._id)) {
                    next();
                  }else{
                      req.flash("error", "You dont have permission to do that.");
                      res.redirect("back");
                  }
                }
            });
        },
        
    checkCommentOwner: function(req, res, next){
            Comment.findById(req.params.comment_id, (err, foundComment) => {
                if(err){
                    req.flash("error", "Comment not found.");
                    res.redirect("back");
                }else{
                    if(foundComment.author.id.equals(req.user._id)) {
                    next();
                  }else{
                      req.flash("error", "You dont have permission to do that.");
                      res.redirect("back");
                  }
                }
            });
        }        


};