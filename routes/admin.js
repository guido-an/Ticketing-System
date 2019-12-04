const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');
const Ticket = require('../models/Ticket');
var ObjectId = require('mongodb').ObjectID;
const multer = require('multer'); // middleware for sending image to the server
const uploadCloud = require('../config/cloudinary');
const sendEmail = require('../config/sendEmail');

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

/*********************************************************
1) USE and show all tickets if admin ******************/
router.use('/', (req, res, next) => {
  if (req.session.currentUser.username === process.env.admin) {
    // <== if there's user in the session (user is logged in) go to the next step
    next();
  } else {
    res.redirect('/auth/login');
  }
});

/*********************************************************
2) GET tickets | admin/admin ******************/
router.get('/', (req, res, next) => {
  Ticket.find()
    .sort({created_at: -1})
    .populate('customer')
    .then(tickets => {
      console.log(tickets, 'tickets');
      res.render('admin/admin', {tickets: tickets});
    })
    .catch(err => {
      console.log(err);
    });
});

/*********************************************************
3) GET ticket detail | admin/adminTicket ******************/
router.get('/ticket/:id', (req, res) => {
  Ticket.findById(req.params.id)
    .populate('user')
    .populate('customer')
    .then(ticket => {
      console.log(ticket.answers, 'tickets answers');
      res.render('admin/adminTicket', {ticket: ticket});
    })
    .catch(err => {
      console.log(err);
    });
});

/*********************************************************
4) POST | admin asnwer and send email ******************/
router.post('/answer', uploadCloud.single('photo'), (req, res) => {
  let {_id, message, title, email} = req.body; // _id, title and email of the ticket (hidden input in adminTicket.hbs)

  let today = new Date();
  minutes = today
    .getMinutes()
    .toString()
    .padStart(2, '0'); // adding a 0 if less then 10
  let date =
    today.getDate() +
    '-' +
    (today.getMonth() + 1) +
    '-' +
    today.getFullYear() +
    ' ' +
    ' | ' +
    today.getHours() +
    ':' +
    minutes;

  if (req.file == undefined) {
    req.file = '';
  }

  let newAnswer = {
    username: process.env.admin,
    message: message,
    time: date,
    admin: true,
    picture: {
      name: req.body.name,
      //path: `/uploads/${req.file.filename}`,
      path: req.file.url,
      originalName: req.file.originalname,
    },
  };

  Ticket.updateOne({_id: _id}, 
    {$push: {answers: newAnswer}, waitingForAnswer: false}, 
    {new: true})
    .then(() => {
      sendEmail(
        process.env.NODEMAILER_EMAIL,
        email,
        `Nuova risposta | ${title}`,
        message +
          '<br><br><a href="http://support.vanillamarketing.it/tickets">Tickets</a>'
      );
      res.redirect('/admin');
    })
    .catch(err => {
      console.log(err);
    });
});

/*********************************************************
5) POST | set ticket to false  *****************************/
router.post('/active-false', (req, res) => {
  Ticket.findOneAndUpdate(
    {_id: ObjectId(req.body._id)},
    {$set: {active: false}},
    {new: true}
  )
    .populate('user')
    .then(ticket => {
      sendEmail(
        ticket.user.email,
        `Ticket Chiuso | ${ticket.title}`,
        `Il ticket '${ticket.title}' è stato chiuso.` +
          '<br><br><a href="http://support.vanillamarketing.it/tickets">Tickets</a>'
      );
    })
    .then(() => {
      res.redirect('/admin');
    })
    .catch(err => {
      console.log(err);
    });
});

/*********************************************************
6) POST | set ticket to true  *****************************/
router.post('/active-true', (req, res) => {
  Ticket.findOneAndUpdate(
    {_id: ObjectId(req.body._id)},
    {$set: {active: true}},
    {new: true}
  )
    .then(() => {
      res.redirect('/admin');
    })
    .catch(err => {
      console.log(err);
    });
});

/*********************************************************
7) GET tickets still active  *****************************/
router.get('/filter-by-status', (req, res) => {
  Ticket.find({active: true})
    .then(activeTickets => {
      res.render('admin/activeTickets', {activeTickets: activeTickets});
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
