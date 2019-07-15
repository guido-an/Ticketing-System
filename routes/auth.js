const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
const Ticket = require("../models/Ticket");
var ObjectId = require("mongodb").ObjectID;


// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

// router.post("/login", passport.authenticate("local", {
//   successRedirect: "/",
//   failureRedirect: "/auth/login",
//   failureFlash: true,
//   passReqToCallback: true
// }));

/* POST LOGIN page */
router.post('/login', (req, res) => {
  let currentUser;
  User.findOne({username: req.body.username})
    .then(user => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      currentUser = user
      return bcrypt.compare(req.body.password, user.password)
    })
    .then(passwordCorrect => {
      if(passwordCorrect) {
        req.session.currentUser = currentUser
        res.redirect("/auth/private")
        console.log("this is the user: ", currentUser)
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
    })
})

/** PROTECTED PAGE */
router.use('/private', (req, res, next) => {
  if (req.session.currentUser) { // <== if there's user in the session (user is logged in) go to the next step 
    next(); 
  } else {                      
    res.redirect("login");         
  }                            
});       
                   
// router.get("/private", (req, res, next) => { 
//    User.findOne({username: req.session.currentUser.username})
//    .then((user) => {
//     res.render("auth/private", { user: user } )
//     console.log("user from get /private", user)
//    })
//   .catch((err) => {
//     console.log(err)
//   })
// });     
router.get("/private", (req, res, next) => { 
  const user = User.findOne({username: req.session.currentUser.username})
  const tickets = Ticket.find({user: ObjectId(req.session.currentUser._id)})

  Promise.all([user, tickets])
  .then((values) => {
    
   res.render("auth/private", { values: values } )
  })
 .catch((err) => {
   console.log(err)
 })
});    


router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("login");
  })
  
});

module.exports = router;
