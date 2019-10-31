const express = require("express");
const router = express.Router();
const Customer = require('../models/Customer')
const Ticket = require('../models/Ticket')


/******************************
1) GET customers - List of customers *********/
router.get('/', (req, res) => {
  Customer.find()
  .then(customers => {
    res.render('customers/customers', { customers })
  })
  .catch(err => {
    console.log(err)
  })
})


/******************************
2) Get new customer page *********/
router.get('/new-customer', (req, res) => {
  res.render("customers/newCustomer")
})


/******************************
3) POST new customer *********/
router.post('/new-customer', (req, res) => {
  Customer.create(req.body)
  .then(() =>{
    res.redirect('/customers')
  })
  .catch(err =>{
    console.log(err)
  })
})

/***********************************
4) GET list of tickets per customer*/
router.get('/tickets/:id', (req, res) => {
  Customer.findById(req.params.id)
  .populate('tickets')
  .then(customer => {
    console.log(customer)
    res.render('customers/customerTickets', { customer } )
    })
    .catch(err =>{
      console.log(err)
    })
  })


module.exports = router;