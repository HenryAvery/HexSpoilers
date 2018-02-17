const express = require("express"),
      router  = express.Router(),
      Card    = require("../models/card"),
      middleware = require("../middleware"),
      multer = require('multer'),
      cloudinary = require('cloudinary'),
      {isLoggedIn, checkCardOwner} = middleware;
      
 

let storage = multer.diskStorage({
  filename: (req, file, callback) => {
    callback(null, Date.now() + file.originalname);
  }
});

let imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Filetype not supported. Please try jpg, png, or gif'), false);
    }
    cb(null, true);
};

let upload = multer({ storage: storage, fileFilter: imageFilter});

cloudinary.config({ 
  cloud_name: 'hexspoilers', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
}); 
 
      
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
router.post("/", isLoggedIn, upload.single('image'), (req, res) => {
    
      cloudinary.uploader.upload(req.file.path, function(result) {
      // add cloudinary url for the image to the card object under image property
      req.body.card.image = result.secure_url;
      // add author to card
      req.body.card.author = {
        id: req.user._id,
        username: req.user.username
      };
      req.body.card.public_id = result.public_id;
      
      Card.create(req.body.card, function(err, card) {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('back');
        }
        res.redirect('/cards/' + card.id);
        });
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
   
   Card.findById(req.params.id, (err, foundCard) => {
       if(err){
            console.log(err);
        }else{
               cloudinary.uploader.destroy(foundCard.public_id);
        }

   });
   
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
