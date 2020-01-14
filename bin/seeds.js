// Seeds file that remove all users and create 2 new users

// To execute this seed, run from the root of the project
// $ node bin/seeds.js

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const Ticket = require('../models/Ticket')

const bcryptSalt = 10

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Errror connecting to mongo', err)
  })

const user = {
  username: 'Enrico',
  password: bcrypt.hashSync('***', bcrypt.genSaltSync(bcryptSalt)),
  email: 'enrico@vanillamarketing.it'
}

// User.deleteMany()
User.create(user)
  // .then(() => {
  //   return User.create(user)
  // })
  .then(usersCreated => {
    Ticket
    console.log(`${usersCreated} user created with the following id:`)
    // console.log(usersCreated.map(u => u._id));
  })
  .then(() => {
    // Close properly the connection to Mongoose
    mongoose.disconnect()
  })
  .catch(err => {
    mongoose.disconnect()
    throw err
  })
