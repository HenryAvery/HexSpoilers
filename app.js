const express    = require("express"),
      bodyParser = require("body-parser"),
      mongoose   = require("mongoose"),
      app        = express(),
      Card = require("./models/card");
      
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/hextcg_spoilers")
app.use(bodyParser.urlencoded({extended: true}));    
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
            res.render("new")
        }else {
            res.redirect("/cards");
        }
    });
});   


     
     
     
      
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started");
});