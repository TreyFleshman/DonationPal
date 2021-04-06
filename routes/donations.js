var express = require('express');
var router = express.Router();
const dateFormat = require('dateformat');
const stripe = require('stripe')(process.env.STRIPE_API_KEY);

const mongoose = require('mongoose');
require('../models/Donation');
const Donation = mongoose.model('Donations');
require('../models/Campaign');
const Campaign = mongoose.model('Campaigns');
require('../models/Transaction');
const Transaction = mongoose.model('Transactions');

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
  
  Donation.findOne({_id: req.query._id})
  .then( donation => {
    Campaign.findOne({_id: donation.rel_id})
    .then(campaign =>{
      Transaction.findOne({rel_donation_id: req.query._id})
      .then(transaction => {      
        res.render('donations/view', {
          key: req.query._id,
          donation: donation,
          campaign: campaign,
          transaction: transaction
        });
      })
    })
  })
});

//GET to donation confirmation page
router.get('/confirmation', (req, res, next) => {
  
  Donation.findOne({_id: req.query._id})
  .then( donation => {
    Campaign.findOne({_id: donation.rel_id})
    .then(campaign =>{
      Transaction.findOne({rel_donation_id: req.query._id})
      .then(transaction => {      
        res.render('donations/confirmation', {
          key: req.query._id,
          donation: donation,
          campaign: campaign,
          transaction: transaction
        });
      })
    })
  })
});

/* GET to the add donation form */
router.get('/add', (req, res, next) => {
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
      var filter = {_id: req.body.rel_id };
      Campaign.findOne(filter)
      .then(campaign => {
      var x = campaign.progress;
      var uptX = parseInt(x) + parseFloat(req.body.don_amt, 2);
      var y = (uptX / campaign.goal) * 100;
      var update = { progress: uptX, progressBar: parseInt(y)}; 
      Campaign.findOneAndUpdate(filter, update)
      .catch( err => console.log(err) ) 
      })
      console.log('Submitting a new donation!')
      var customer = await createCustomer(req);
      var charge = await createCharge(req.body.don_amt, req.body.message, customer, req.body.rel_id, req.user.providerID);
      const newDonation = new Donation( {
          rel_id: req.body.rel_id,
          user:{
              creator_id: req.user.providerID,
              displayName: req.user.displayName
          },
          message: req.body.message,
          don_amt: parseFloat(req.body.don_amt, 2),
          date: dateFormat(req.body.date, "fullDate"),
      } );
      newDonation
      .save()
      .then( () => console.log('Donation Saved!') )
      .then( () => { res.redirect('/donations/confirmation?_id=' + newDonation._id) } )
      .catch( err => console.log(err) )

      const newTransaction = new Transaction( {
          rel_campaign_id: req.body.rel_id,
          rel_donation_id: newDonation._id,
          creator_id: req.user.providerID,
          don_amt: req.body.don_amt,
          date: dateFormat(req.body.date, "fullDate"),
          customer: customer,
          charge: charge,
      });
      newTransaction
      .save()
      .then( () => console.log('Transaction Saved!') )

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

const createCharge = async function(amount, message, customer, campaign_id, user_id) {
    var charge = await stripe.charges.create({
       amount: amount*100,
       currency: 'usd',
       customer: customer.id,
       description: message,
       metadata: {
           user_id: user_id,
           campaign_id: campaign_id
       } 
    });
    return charge;
};