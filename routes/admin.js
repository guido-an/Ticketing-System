const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const Ticket = require("../models/Ticket");
var ObjectId = require("mongodb").ObjectID;
const multer = require("multer"); // middleware for sending image to the server
const uploadCloud = require("../config/cloudinary");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

/********************
1) USE and GET tickets */
router.use("/admin", (req, res, next) => {
  if (req.session.currentUser.username === process.env.admin) {
    // <== if there's user in the session (user is logged in) go to the next step
    next();
  } else {
    res.redirect("/auth/login");
  }
});

router.get("/admin", (req, res, next) => {
  Ticket.find()
    .then(tickets => {
      res.render("admin/admin", { tickets: tickets });
    })
    .catch(err => {
      console.log(err);
    });
});

/********************
3) GET specific ticket */
router.get("/admin/ticket/:id", (req, res) => {
  Ticket.findById(req.params.id)
    .then(ticket => {
      console.log("ticket", ticket);
      res.render("admin/adminTicket", { ticket: ticket });
    })
    .catch(err => {
      console.log(err);
    });
});

/********************
4) POST admin answer */
router.post("/admin/answer", uploadCloud.single("photo"), (req, res) => {
  let { _id, message } = req.body; // _id of the ticket (hidden input in userTicket.hbs)
  let today = new Date();
  let date =
    today.getDate() +
    "-" +
    (today.getMonth() + 1) +
    "-" +
    today.getFullYear() +
    " " +
    " | " +
    today.getHours() +
    ":" +
    today.getMinutes();

  if (req.file == undefined) {
    req.file = "";
  }
  

  let newAnswer = {
    username: process.env.admin,
    message: message,
    time: date,
    picture: {
      name: req.body.name,
      //path: `/uploads/${req.file.filename}`,
      path: req.file.url,
      originalName: req.file.originalname
    }
  };

  Ticket.updateOne(
    { _id: _id },
    { $push: { answers: newAnswer } },
    { new: true }
  )
    .then(() => {
      console.log("this is req.body", req.body);
      res.redirect("/admin");
    })
    .catch(err => {
      console.log(err);
    });
});

/**************************
5) POST status ticket false */
router.post("/admin/active-false", (req, res) => {
  Ticket.findOneAndUpdate(
    { _id: ObjectId(req.body._id) },
    { $set: { active: false } },
    { new: true }
  )
    .then(() => {
      res.redirect("/admin");
    })
    .catch(err => {
      console.log(err);
    });
});

/**************************
6) POST status ticket true */
router.post("/admin/active-true", (req, res) => {
  Ticket.findOneAndUpdate(
    { _id: ObjectId(req.body._id) },
    { $set: { active: true } },
    { new: true }
  )
    .then(() => {
      res.redirect("/admin");
    })
    .catch(err => {
      console.log(err);
    });
});

/**************************
6) GET filtered tickets by status */
router.get("/admin/filter-by-status", (req, res) => {
  Ticket.find({ active: true })
    .then(activeTickets => {
      console.log(activeTickets);
      res.render("admin/activeTickets", { activeTickets: activeTickets });
    })
    .catch(err => {
      console.log(err);
    });
});

/**************************
8) GET filtered tickets by author */
// router.get("/admin/filter-by-author/:author", (req, res) => {
//   Ticket.find({ author: req.params.author })
//     .then(ticketsByAuthor => {
//       res.render("admin/ticketsByAuthor", { ticketsByAuthor: ticketsByAuthor });
//     })
//     .catch(err => {
//       console.log(err);
//     });
// });

module.exports = router;
