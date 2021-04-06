var express = require('express');
var router = express.Router();
const dateFormat = require('dateformat');

const mongoose = require('mongoose');
require('../models/Campaign');
const Campaign = mongoose.model('Campaigns');
require('../models/Donation');
const Donation = mongoose.model('Donations');
require('../models/User');
const User = mongoose.model('Users');

// Middlewear to report auth status
const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    // authenticated
    next();
  } else {
    res.render('users/not_auth')
  }
}


/* GET listing of all campaigns */
router.get('/', (req, res, next) => {

  Campaign.find({})
  .sort({start_date: 'asc'})
  .then( campaigns => {
    res.render('campaigns/index', { title: "Listed Campaigns", campaignlist: campaigns})
  });
});

/* GET sinlge campaign */
router.get('/view', (req, res, next) => {
  
  Campaign.findOne({ _id: req.query._id })
  .then( campaign => {
    var prog_precent = (campaign.progress / campaign.goal) * 100;
    prog_precent = prog_precent.toFixed(2);
    var remaining = campaign.goal - campaign.progress;
    console.log(prog_precent);
    Donation.find({ rel_id: req.query._id })
    .then( donations => {
      for(i=0;i<donations.length;i++){
      var id = donations[i].creator_id;
      }
      User.find({providerID: id})     
      .then(users=> {             
        res.render('campaigns/view', {
          title: campaign ? campaign.title: "",
          key: req.query._id,
          prog_precent,
          remaining,
          users: users,
          campaign: campaign,
          donationList: donations
        });
      })      
    })
  })
});

/* GET sinlge campaign - User */
router.get('/user-view', (req, res, next) => {
  
  Campaign.findOne({
      _id: req.query._id
    })

  .then( campaign => {
      res.render('users/user_view', {
        title: campaign ? campaign.title: "",
        key: req.query._id,
        campaign: campaign 
      });
    })
});

/* GET sinlge campaign THEN Update Document */
router.get('/update', ensureAuth, (req, res, next) => {

  Campaign.findOne({
      _id: req.query._id
  })
  
  .then( campaign => {
      res.render('campaigns/update', {
        key: req.query._id,
        campaign: campaign
      });
  }) 
  .catch( err => console.log(err) ) 
});

/* POST Update */
router.post('/save-update', ensureAuth, (req, res, next) => {
    Campaign.findOneAndUpdate({_id: req.body._id }, {
        creator_id: req.user.providerID,
        title: req.body.title,
        desc: req.body.desc,
        goal: req.body.goal,
        progress: req.query.progress,
        start_date: dateFormat(req.body.start_date, "fullDate"),
        end_date: dateFormat(req.body.end_date, "fullDate")
    })
    .then( () => { res.redirect('/campaigns/view?_id=' + req.body._id) } )
    .catch( err => console.log(err) )  
});

/* GET to the add campaign form */
router.get('/add', ensureAuth, (req, res, next) => {    
  res.render('campaigns/edit',{
      title: "Add a Campaign",
      docreate: true,
      key: "", campaign: undefined
  });
});

/* Delete Campaign */
router.get('/delete', ensureAuth, (req, res, next) => {
  
  Campaign.deleteOne({
      _id: req.query._id
  })  
  .then( campaign => {
      res.render('users/user-delete', {
        title: campaign ? campaign.title: "",
        key: req.query._id,
        campaign: campaign
      });
  })
});

/* POST */
router.post('/save', ensureAuth, (req,res,next) => {
  if (req.body.docreate === 'create') {
      console.log('Creating a new campaign!')    
      const newCampaign = new Campaign( {
          creator_id: req.user.providerID,
          title: req.body.title,
          desc: req.body.desc,
          goal: req.body.goal,
          progress: 0,
          start_date: dateFormat(req.body.start_date, "fullDate"),
          end_date: dateFormat(req.body.end_date, "fullDate")
      } );
      newCampaign
      .save()
      .then( () => console.log('Campaign Saved!') )
      .then( () => { res.redirect('/campaigns/view?_id=' + newCampaign._id) } )
      .catch( err => console.log(err) )

  }else {
    console.log('Editing Campaign!')
  }

});


module.exports = router;