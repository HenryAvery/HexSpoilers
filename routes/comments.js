const express = require("express"),
         Card = require("../models/card"),
      Comment = require("../models/comment"),
       router = express.Router({mergeParams: true});
       
       
//comments new
router.get("/new", (req, res) => {
    Card.findById(req.params.id, (err, card) => {
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {card: card});
        }
    });
});

//comments create
router.post("/", (req, res) => {
   Card.findById(req.params.id, (err, card) => {
       if(err){
           console.log(err);
       }else{
           Comment.create(req.body.comment, (err, comment) => {
              if(err){
                  console.log(err);
              } else {
                  card.comments.push(comment);
                  card.save();
                  res.redirect("/cards/" + card._id);
              }
           });
       }
   }); 
});


module.exports = router;