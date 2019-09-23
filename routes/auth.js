const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const Ticket = require("../models/Ticket");
var ObjectId = require("mongodb").ObjectID;

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/******************************
1) GET login  *********/
router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

/******************************
2) POST login  *********/
router.post("/login", (req, res) => {
  let currentUser;
  User.findOne({ username: req.body.username })
    .then(user => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      currentUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(passwordCorrect => {
      if (passwordCorrect) {
        req.session.currentUser = currentUser;
        res.redirect("/auth/private");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
    });
});

/******************************
3) USE and GET private  *********/
router.use("/private", (req, res, next) => {
  // change this line of code with .env in production!!!!
  if (req.session.currentUser.username === process.env.admin) { // if the user is the admin go to admin page - 
    res.redirect("/admin");
  } else if (req.session.currentUser) { // <== if there's user in the session (user is logged in) go to the next step
    next();
  } else {
    res.redirect("login");
  }
});

router.get("/private", (req, res, next) => {
  const user = User.findOne({ username: req.session.currentUser.username });
  const tickets = Ticket.find({ user: ObjectId(req.session.currentUser._id)}).sort( { created_at: -1 });

  Promise.all([user, tickets])
    .then(values => {
        res.redirect("/tickets")
    })
    .catch(err => {
      console.log(err);
    });
});

/******************************
4) GET signup  *********/
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

/******************************
5) POST signup  *********/
router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
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
      password: hashPass,
      email
    });

    newUser
      .save()
      .then(() => {
        res.redirect("/");
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      });
  });
});

/******************************
6) GET logout  *********/
router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    res.redirect("login");
  });
});

module.exports = router;
