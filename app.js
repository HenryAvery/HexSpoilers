const methodOverride = require("method-override"),
      LocalStrategy  = require("passport-local"),
      bodyParser     = require("body-parser"),
      mongoose       = require("mongoose"),
      passport       = require("passport"),
      express        = require("express"),
      User           = require("./models/user"),
      app            = express();
      

//requiring routes
const cardRoutes = require("./routes/cards"),
   commentRoutes = require("./routes/comments"),
   indexRoutes      = require("./routes/index");
     
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/hextcg_spoilers");
app.use(bodyParser.urlencoded({extended: true}));   
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");      



//passport config
app.use(require("express-session")({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRoutes);
app.use("/cards", cardRoutes);
app.use("/cards/:id/comments", commentRoutes);



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started");
});