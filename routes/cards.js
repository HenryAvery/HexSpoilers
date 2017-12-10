const express = require("express"),
       router = express.Router(),
         Card = require("../models/card");

//Index
router.get("/", (req, res) => {
    Card.find({}, (err, allCards) => {
       if(err){
           console.log(err);
       } else{
           res.render("cards/index", {cards:allCards});
       }
    });
});

//New
router.get("/new", (req, res) => {
    res.render("cards/new");
});

//Create
router.post("/", (req, res) => {
    Card.create(req.body.card, (err, newCard) => {
        if(err){
            console.log(err);
            res.render("new");
        }else {
            res.redirect("/cards");
        }
    });
});   

//Show
router.get("/:id", (req, res) => {
    Card.findById(req.params.id, (err, foundCard) => {
        if(err){
            console.log(err);
        }else{
            res.render("cards/show", {card: foundCard});
        }
    });
});
     
//Edit
router.get("/:id/edit", (req, res) => {
    Card.findById(req.params.id, (err, foundCard) => {
        if(err){
            console.log(err);
        }else{
            res.render("cards/edit", {card: foundCard});
        }
    });
});

//Update
router.put("/:id", (req, res) => {
    Card.findByIdAndUpdate(req.params.id, req.body.card, (err, foundCard) => {
        if(err) {
            console.log(err);
        }else{
            res.redirect("/cards/" + req.params.id);
        }     
    });
});
//Delete
router.delete("/:id", (req, res) => {
   Card.findByIdAndRemove(req.params.id, (err) => {
     if(err){
         console.log(err);
     }else{
         res.redirect("/cards");
     }  
   });
});
      
module.exports = router;