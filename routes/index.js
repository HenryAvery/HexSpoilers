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
    let errors = "";
    res.render("register", {errors : errors});
});

//register logic
router.post("/register", (req, res) => {
    req.checkBody("password2", "Passwords do not match.").equals(req.body.password);
    let errors = req.validationErrors();
    if (errors) {
        res.render("register", {errors : errors, username : req.body.username});
        return;
    }else{
        let newUser = new User({username: req.body.username});
        User.register(newUser, req.body.password, (err, user) => {
            if(err){
                req.flash("error", err.message);
                return res.redirect("register");
            }
            passport.authenticate("local")(req, res, () => {
                req.flash("success", "Successfully Signed Up!");
                res.redirect("/cards");
            });
        });
    }
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
    req.flash("success", "Logged out!");
    res.redirect("/cards");
});


module.exports = router;