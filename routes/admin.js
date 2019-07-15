const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const Ticket = require("../models/Ticket");
var ObjectId = require("mongodb").ObjectID;

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.use("/admin", (req, res, next) => {
  if (req.session.currentUser.username === "admin") {
    // <== if there's user in the session (user is logged in) go to the next step
    next();
  } else {
    res.redirect("/admin");
  }
});

router.get("/admin", (req, res, next) => {
  Ticket.find().then(tickets => {
    console.log(req.session.currentUser)
    res.render("admin/admin", { tickets: tickets });
  });
});

module.exports = router;
