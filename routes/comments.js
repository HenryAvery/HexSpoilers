const express    = require("express"),
      Card       = require("../models/card"),
      Comment    = require("../models/comment"),
      middleware = require("../middleware"),
      router     = express.Router({mergeParams: true}),
      { isLoggedIn, checkCommentOwner } = middleware;
       
       
//New
router.get("/new", isLoggedIn, (req, res) => {
    Card.findById(req.params.id, (err, card) => {
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {card: card});
        }
    });
});

//Create
router.post("/", isLoggedIn, (req, res) => {
   Card.findById(req.params.id, (err, card) => {
       if(err){
           console.log(err);
       }else{
           Comment.create(req.body.comment, (err, comment) => {
              if(err){
                  console.log(err);
              }else{
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  comment.save();
                  card.comments.push(comment._id);
                  card.save();
                  req.flash("success", "Successfully added commment");
                  res.redirect("/cards/" + card._id);
              }
           });
       }
   }); 
});

//Edit
router.get("/:comment_id/edit", isLoggedIn, checkCommentOwner, (req, res) => {
    Card.findById(req.params.id, (err, foundCard) => {
        if(err || !foundCard){
            req.flash("error", "No card found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err){
                console.log(err);
            } else {
                res.render("comments/edit", {card_id: req.params.id, comment: foundComment});
            }
        });
    });
});

//Update
router.put("/:comment_id", isLoggedIn, checkCommentOwner, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment ) => {
        if(err){
            console.log(err);
        }else{
            res.redirect("/cards/" + req.params.id);
        }
    });
});

//Destroy
router.delete("/:comment_id", isLoggedIn, checkCommentOwner, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err){
            console.log(err);
        }else{
            req.flash("success", "Comment deleted");
            res.redirect("/cards/" + req.params.id);
        }
    });
});


module.exports = router;