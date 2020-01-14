const express = require('express')
const router = express.Router()

const privateRouteAdmin = (req, res, next) => {
  const currentUser = req.session.currentUser
  if (currentUser && currentUser.admin === true) {
    return next()
  } else {
    return res.redirect('/auth/login')
  }
}

module.exports = privateRouteAdmin
