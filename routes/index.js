const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
var ObjectId = require("mongodb").ObjectID;

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

/* GET submit  */
router.use("/submit", (req, res, next) => {
  if (req.session.currentUser) {
    // <== if there's user in the session (user is logged in) go to the next step
    next();
  } else {
    res.redirect("/auth/login");
  }
});

router.get("/submit", (req, res, next) => {
  console.log("from /submit", req.session.currentUser);
  res.render("submit", { user: req.session.currentUser });
});

/* POST ticket */
router.post("/submit", (req, res) => {
  var myTicket = new Ticket({
    title: req.body.title,
    message: req.body.message,
    user: req.body.user
  });
  myTicket
    .save()
    .then(() => {
      console.log("this is my ticket", myTicket);
      res.send("ticket created");
    })
    .catch(err => {
      console.log(err);
    });
});

/* GET ticket  */
router.get("/tickets", (req, res) => {
  if (req.session.currentUser) {
    Ticket.find({ user: ObjectId(req.session.currentUser._id) })
      .then(tickets => {
        console.log("the tickets cominggg", tickets);
        res.render("tickets", { tickets: tickets });
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    res.redirect("/auth/login");
  }
});

router.get("/tickets/:id", (req, res) => {
  Ticket.findById(req.params.id)
    .then(ticket => {
      console.log("my ticket", ticket)
      res.render("myticket", { ticket: ticket });
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
