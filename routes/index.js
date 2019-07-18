const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const User = require("../models/User");
var ObjectId = require("mongodb").ObjectID;

/******************************
1) GET home  *********/
router.get("/", (req, res, next) => {
  res.render("index");
});

/******************************
2) USE and GET submit  *********/
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

/******************************
3) POST submit  *********/
router.post("/submit", (req, res) => {
  var myTicket = new Ticket({
    title: req.body.title,
    message: req.body.message,
    user: req.body.user,
    active: true
  });
  myTicket
    .save()
    .then(() => {
      console.log("this is my ticket", myTicket);
      res.render("submit", { message: "ticket created succesfully" });
    })
    .catch(err => {
      console.log(err);
    });
});

/******************************
4) GET tickets  *********/
router.get("/tickets", (req, res) => {
  if (req.session.currentUser) {
    Ticket.find({ user: ObjectId(req.session.currentUser._id) })
      .then(tickets => {
        res.render("tickets", { tickets: tickets });
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    res.redirect("/auth/login");
  }
});

/******************************
5) GET tickets details  *********/
router.get("/tickets/:id", (req, res) => {
  const user = User.findOne({ username: req.session.currentUser.username });
  const ticket = Ticket.findById(req.params.id);
  Promise.all([user, ticket])
    .then(values => {
      res.render("userTicket", { values: values });
    })
    .catch(err => {
      console.log(err);
    });
});

router.post("/answer", (req, res) => {
  let { _id, message } = req.body; // _id of the ticket (hidden input in userTicket.hbs)

  let newAnswer = {
    username: req.session.currentUser.username,
    message: message
  };

  Ticket.updateOne({
    _id: _id,
    $push: { answers: newAnswer },
    $set: { active: true },
    new: true
  })

    .then(() => {
      res.redirect("/auth/private");
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
