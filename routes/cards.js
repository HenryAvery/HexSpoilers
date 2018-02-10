const express = require("express"),
      router  = express.Router(),
      Card    = require("../models/card"),
      middleware = require("../middleware"),
      {isLoggedIn, checkCardOwner} = middleware;
      
//Index
router.get("/", (req, res) => {
    let perPage = 12;
    let pageQuery = parseInt(req.query.page);
    let pageNumber = pageQuery ? pageQuery : 1;
    Card.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec((err, allCards) => {
        Card.count().exec(function (err, count) {
           if(err){
               console.log(err);
           } else{
               res.render("cards/index", {
                   cards:allCards,
                   current: pageNumber,
                   pages: Math.ceil(count / perPage)
    
               });
           }
        });
    });
});

//New
router.get("/new", isLoggedIn, (req, res) => {
    res.render("cards/new");
});

//Create
router.post("/", isLoggedIn, (req, res) => {
    
    req.body.card.author = {
        id: req.user._id,
        username: req.user.username            
    };

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
    Card.findById(req.params.id).populate("comments").exec((err, foundCard) => {
        if(err || !foundCard){
            req.flash("error" , "Card not found");
            res.redirect("back");
        }else{
            res.render("cards/show", {card: foundCard});
        }
    });
});
     
//Edit
router.get("/:id/edit", isLoggedIn, checkCardOwner, (req, res) => {
    Card.findById(req.params.id, (err, foundCard) => {
        if(err){
            console.log(err);
        }else{
            res.render("cards/edit", {card: foundCard});
        }
    });
});

//Update
router.put("/:id", isLoggedIn, checkCardOwner, (req, res) => {
    Card.findByIdAndUpdate(req.params.id, req.body.card, (err, foundCard) => {
        if(err) {
            console.log(err);
        }else{
            res.redirect("/cards/" + req.params.id);
        }     
    });
});
//Delete
router.delete("/:id", isLoggedIn, checkCardOwner, (req, res) => {
   Card.findByIdAndRemove(req.params.id, (err) => {
     if(err){
         console.log(err);
     }else{
         req.flash("success", "Card deleted");
         res.redirect("/cards");
     }  
   });
});


module.exports = router;
