const Card    = require("../models/card"),
      Comment = require("../models/comment");

module.exports = {
    
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect("/login");
    },
    
    checkCardOwner: function(req, res, next){
            Card.findById(req.params.id, (err, foundCard) => {
                if(err){
                    res.redirect("back");
                }else{
                    if(foundCard.author.id.equals(req.user._id)) {
                    next();
                  }else{
                      res.redirect("back");
                  }
                }
            });
        },
        
    checkCommentOwner: function(req, res, next){
            Comment.findById(req.params.comment_id, (err, foundComment) => {
                if(err){
                    res.redirect("back");
                }else{
                    if(foundComment.author.id.equals(req.user._id)) {
                    next();
                  }else{
                      res.redirect("back");
                  }
                }
            });
        }        


};