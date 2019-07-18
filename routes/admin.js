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
  if (req.session.currentUser.username === process.env.admin) {
    // <== if there's user in the session (user is logged in) go to the next step
    next();
  } else {
    res.redirect("/auth/login");
  }
});

router.get("/admin", (req, res, next) => {
  Ticket.find().then(tickets => {
    res.render("admin/admin", { tickets: tickets });
  });
});

/********************
3) GET admin tickets */
router.get("/admin/tickets/:id", (req, res) => {
  Ticket.findById(req.params.id)
    .then((ticket) => {
      console.log("that's the ticket", ticket)
      res.render("admin/adminTicket", {ticket: ticket});
    })
    .catch(err => {
      console.log(err);
    });
});

/********************
4) POST admin answer */
router.post("/admin/answer", (req, res) => {
  let { _id, message } = req.body // _id of the ticket (hidden input in userTicket.hbs)

  let newAnswer = {
    username: process.env.admin,
    message: message
  };
  
  Ticket.updateOne(
    { _id: _id },
    { $push: { answers: newAnswer } },
    { new: true }
  )
    .then(() => {
      console.log("this is req.body", req.body)
      res.redirect("/admin")
    })
    .catch(err => {
      console.log(err);
    });
});

/**************************
5) POST status ticket false */
router.post('/admin/active-false', (req, res) => {
  Ticket.findOneAndUpdate(
    {_id: ObjectId(req.body._id)},
    {$set: {active: false}},
    {new: true}
  )  .then(()=> {
    res.redirect("/admin")
  })
  .catch((err) => {
    console.log(err)
  })
})

module.exports = router;
