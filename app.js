const express    = require("express"),
      methodOverride = require("method-override"),
      bodyParser = require("body-parser"),
      mongoose   = require("mongoose"),
      app        = express();


const cardRoutes = require("./routes/cards");
     
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/hextcg_spoilers");
app.use(bodyParser.urlencoded({extended: true}));   
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");      

app.use("/cards", cardRoutes);



//root route
app.get("/", (req, res) => {
    res.render("landing");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started");
});