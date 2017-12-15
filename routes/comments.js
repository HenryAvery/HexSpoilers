const express = require("express"),
         Card = require("../models/card"),
      Comment = require("../models/comment"),
       router = express.Router({mergeParams: true});
       
       
//New
router.get("/new", (req, res) => {
    Card.findById(req.params.id, (err, card) => {
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {card: card});
        }
    });
});

//Create
router.post("/", (req, res) => {
   Card.findById(req.params.id, (err, card) => {
       if(err){
           console.log(err);
       }else{
           Comment.create(req.body.comment, (err, comment) => {
              if(err){
                  console.log(err);
              }else{
                  card.comments.push(comment);
                  card.save();
                  res.redirect("/cards/" + card._id);
              }
           });
       }
   }); 
});

//Edit
router.get("/:comment_id/edit", (req, res) => {
    Card.findById(req.params.id, (err, foundCard) => {
        if(err){
            console.log(err);
        }else{
            Comment.findById(req.params.comment_id, (err, foundComment) => {
                if(err){
                    console.log(err);
                }else{
                    res.render("comments/edit", {card_id: req.params.id, comment: foundComment});
                }
            });
        }
    });
});

//Update
router.put("/:comment_id", (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment ) => {
        if(err){
            console.log(err);
        }else{
            res.redirect("/cards/" + req.params.id);
        }
    });
});

//Destroy
router.delete("/:comment_id", (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err){
            console.log(err);
        }else{
            res.redirect("/cards/" + req.params.id);
        }
    });
});


module.exports = router;