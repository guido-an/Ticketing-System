const express = require('express');
const router = express.Router();



const privateRouteAdmin = (req, res, next) => {
  const currentUser = req.session.currentUser
  if (currentUser && currentUser.username === process.env.admin || currentUser.username === process.env.admin2 ) {
    return next();
  } else {
    return res.redirect('/auth/login');
  }
};


module.exports = privateRouteAdmin
