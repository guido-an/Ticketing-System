const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const User = require("../models/User");
const Customer = require("../models/Customer");
var ObjectId = require("mongodb").ObjectID;
const multer  = require('multer'); // middleware for sending image to the server
const uploadCloud = require('../config/cloudinary');
const nodemailer = require("nodemailer");

const bodyParser = require('body-parser')



/******************************
1) GET home  *********/
router.get("/", (req, res) => {
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
  Customer.find().sort({"name": 1})
  .then(customers => {
    res.render("user/submit", { user: req.session.currentUser, customers: customers  });
  })
  .catch(err => {
    console.log(err)
  })

});

/******************************
3) POST submit - Create new ticket *********/
router.post("/submit",  uploadCloud.single('photo'), (req, res) => {
console.log(req.body)
  /* nodemailer */ 
  let transporter = nodemailer.createTransport({
    host: "hostingssd12.netsons.net",
    port: 465,
    secure: true, // use TLS
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PSW
    }
  });

  transporter.sendMail({
    // email to the ADMIN
    from: process.env.NODEMAILER_EMAIL,
    to: process.env.ADMIN_EMAIL,
    subject: `Nuovo ticket| ${req.body.title}`,
    text: req.body.message,
    html: req.body.message + '<br><br><a href="http://support.vanillamarketing.it/admin">Ticket</a>'
  })

  /* new ticket */
  let today = new Date();
  minutes = today.getMinutes().toString().padStart(2, '0') // adding a 0 if less then 10
  let date = today.getDate() + '-'+(today.getMonth()+1) + "-" + today.getFullYear()+ ' ' + " | " +  today.getHours() + ":" + minutes ;

  if(req.file == undefined){
    req.file = ""
  }
  let myTicket = new Ticket({
    author: req.session.currentUser.username,
    title: req.body.title,
    message: req.body.message,
    user: req.body.user,
    active: true,
    time: date,
    customer: "5dbafb234c20f734f8b2fc01",
    picture: {
      name: req.body.name,
      path: req.file.url,
      originalName: req.file.originalname
    }
  });
  myTicket
    .save()
    .then(() => {
      res.redirect("/tickets");
    })
    .catch(err => {
      console.log(err);
    });
});




/******************************
4) GET tickets  *********/
router.get("/tickets", (req, res) => {
  if (req.session.currentUser) {
    Ticket.find({ user: ObjectId(req.session.currentUser._id) }).sort({ created_at: -1 })
      .then(tickets => {
        res.render("user/tickets", { tickets: tickets, user: req.session.currentUser });
        
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
      res.render("user/userTicket", { values: values });
    })
    .catch(err => {
      console.log(err);
    });
});



router.post("/answer", uploadCloud.single('photo'), (req, res) => {
  let { _id, message } = req.body; // _id of the ticket (hidden input in userTicket.hbs)
  let today = new Date();
  let date =
    today.getFullYear() +
    " " +
    today.getDate() +
    " " +
    (today.getMonth() + 1) +
    " | " +
    today.getHours() +
    ":" +
    today.getMinutes();

    if(req.file == undefined){
      req.file = ""
    }

  let newAnswer = {
    username: req.session.currentUser.username,
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
    { $push: { answers: newAnswer }, active: true },
    { new: true }
  )
    .then(() => {
      res.redirect("/tickets");
    })
    .catch(err => {
      console.log(err);
    });
});


/**************************
6) GET active tickets */
router.get("/active-tickets", (req, res) => {
  
  Ticket.find({ author: req.session.currentUser.username, active: true } )
    .then(activeTickets => {
      res.render("user/activeTickets", { activeTickets: activeTickets });
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
