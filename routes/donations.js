var express = require('express');
var router = express.Router();
const dateFormat = require('dateformat');
const stripe = require('stripe')(process.env.STRIPE_API_KEY);

const mongoose = require('mongoose');
require('../models/Donation');
const Donation = mongoose.model('Donations');
require('../models/Campaign');
const Campaign = mongoose.model('Campaigns');

// Middlewear to report auth status
const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    // authenticated
    next();
  } else {
    res.render('users/not_auth')
  }
}

/* GET listing of all donations */
router.get('/', (req, res, next) => {

  Donation.find({})
  .sort({date: 'asc'})
  .then( donations => {
    res.render('donations/index', { title: "Submited Donations", donationlist: donations})
  });
});

/* GET sinlge donation */
router.get('/view', (req, res, next) => {
  
  Donation.findOne({
      _id: req.query._id
  })
  .then( donation => {
      res.render('donations/view', {
        key: req.query._id,
        donation: donation
      });
  })
});

/* GET to the add donation form */
router.get('/add', ensureAuth, (req, res, next) => {
  Campaign.find({})
.then( campaigns => {
  res.render('donations/edit',{
      title: "Submit a Donation",
      docreate: true,
      key: "", donation: undefined,
      campaignlist: campaigns})  
})
.then(() => console.log(campaignlist))
.catch(err => console.log(err))
});

/* POST */
router.post('/save', ensureAuth, async (req,res,next) => {
  if (req.body.docreate === 'create') {
      console.log('Submitting a new donation!')
      var customer = await createCustomer(req);
      var charge = await createCharge(req.body.don_amt, req.body.message, customer, req.body.rel_id);
      const newDonation = new Donation( {
          rel_id: req.body.rel_id,
          creator_id: req.user.providerID,
          message: req.body.message,
          don_amt: req.body.don_amt,
          date: dateFormat(req.body.date, "fullDate"),
          customer: customer,
          charge: charge,
      } );
      newDonation
      .save()
      .then( () => console.log('Donation Saved!') )
      .then( () => { res.redirect('/donations/view?_id=' + newDonation._id) } )
      .catch( err => console.log(err) )

  }else {
    console.log('Editing Donation!')
  }

});


module.exports = router;

//Helper Functions
const createCustomer = async function(req) {
    var customer = await stripe.customers.create({
        name: req.user.firstName + ' ' + req.user.lastName,
        email: req.user.email,
        source: req.body.stripeToken
    });
    return customer;
};

const createCharge = async function(amount, message, customer, campaign_id) {
    var charge = await stripe.charges.create({
       amount: amount*100,
       currency: 'usd',
       customer: customer.id,
       description: message,
       metadata: {
           campaign_id: campaign_id
       } 
    });
    return charge;
};