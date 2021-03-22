require('dotenv').config()
var express = require('express');
var router = express.Router();
var session = require('express-session');
var passport = require('passport');
var GoogleStrategy = require ('passport-google-oauth').OAuth2Strategy;
var User = require('../models/User.js');

const mongoose = require('mongoose');
require('../models/Campaign');
const Campaign = mongoose.model('Campaigns');
require('../models/Donation');
const Donation = mongoose.model('Donations');

require('../services/passport_google');

/* GET user profile */
router.get('/', function(req, res, next) {
  // If user loged in
  if(req.isAuthenticated() ) {
    loggedInUser = req.user;
    Campaign.find({ 'creator_id': req.user.providerID })
    .then( campaigns =>  { 
      Donation.find({ 'creator_id': req.user.providerID })
      .then( donations => {
        res.render('users/user_profile', {
        title: 'Profile',
        displayName: loggedInUser.displayName,
        email: loggedInUser.email,
        userImage: loggedInUser.picture,
        campaignList: campaigns,
        donationList: donations
        })
      })
    })
  } else { res.render('users/user_no_profile'); }
});

/* GET to Google login */
router.get('/login', 
  passport.authenticate('google', { scope: ['profile', 'email'] } )
);

/* GET Logout */ 
router.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy((err) => {
      if (err) return next(err);
      return res.redirect('/users/');
    })
  }
);

/* GET to Google return */
router.get('/return', 
  passport.authenticate('google', { failureRedirect: '/users/login' } ),
  function( req, res ){
    res.redirect('/users/')
  }
);


module.exports = router;
