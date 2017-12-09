const express    = require("express"),
      methodOverride = require("method-override"),
      bodyParser = require("body-parser"),
      mongoose   = require("mongoose"),
      app        = express(),
      Card = require("./models/card");
      
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/hextcg_spoilers");
app.use(bodyParser.urlencoded({extended: true}));   
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");      

//Landing Page
app.get("/", (req, res) => {
    res.render("landing");
});


//Index
app.get("/cards", (req, res) => {
    Card.find({}, (err, allCards) => {
       if(err){
           console.log(err);
       } else{
           res.render("cards/index", {cards:allCards});
       }
    });
});

//New
app.get("/cards/new", (req, res) => {
    res.render("cards/new");
});

//Create
app.post("/cards", (req, res) => {
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
app.get("/cards/:id", (req, res) => {
    Card.findById(req.params.id, (err, foundCard) => {
        if(err){
            console.log(err);
        }else{
            res.render("cards/show", {card: foundCard});
        }
    });
});
     
//Edit
app.get("/cards/:id/edit", (req, res) => {
    Card.findById(req.params.id, (err, foundCard) => {
        if(err){
            console.log(err);
        }else{
            res.render("cards/edit", {card: foundCard});
        }
    });
});

//Update
app.put("/cards/:id", (req, res) => {
    Card.findByIdAndUpdate(req.params.id, req.body.card, (err, foundCard) => {
        if(err) {
            console.log(err);
        }else{
            res.redirect("/cards/" + req.params.id);
        }     
    });
});
//Delete
app.delete("/cards/:id", (req, res) => {
   Card.findByIdAndRemove(req.params.id, (err) => {
     if(err){
         console.log(err);
     }else{
         res.redirect("/cards");
     }  
   });
});
      
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started");
});