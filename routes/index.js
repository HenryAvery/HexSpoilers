const express  = require("express"),
      passport = require("passport"),
      User     = require("../models/user"),
      router   = express.Router();


//root route
router.get("/", (req, res) => {
    res.render("landing");
});   

//register form         
router.get("/register", (req, res) => {
    res.render("register");
});

//register logic
router.post("/register", (req, res) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/cards");
        });
    });
});

//login page
router.get("/login", (req, res) => {
   res.render("login"); 
});

//login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/cards",
        failureRedirect: "/login",
        
    }), (req, res) => {
    
});

//logout
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/cards");
});


module.exports = router;