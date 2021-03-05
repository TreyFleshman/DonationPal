var express = require('express');
var router = express.Router();
const campaigns = require('../models/campaigns-memory');
const dateFormat = require('dateformat');

const mongoose = require('mongoose');
require('../models/Campaign');
const Campaign = mongoose.model('Campaigns');

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
  
  Campaign.findOne({
      _id: req.query._id
    })

  .then( campaign => {
      res.render('campaigns/view', {
        title: campaign ? campaign.title: "",
        key: req.query._id,
        campaign: campaign 
      });
    })
});

/* GET sinlge campaign THEN Update Document */
router.get('/update', (req, res, next) => {
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
router.post('/save-update', (req, res, next) => {
    Campaign.findOneAndUpdate({_id: req.body._id }, {
        title: req.body.title,
        desc: req.body.desc,
        goal: req.body.goal,
        start_date: dateFormat(req.body.start_date, "fullDate"),
        end_date: dateFormat(req.body.end_date, "fullDate")
    })
    .then( () => { res.redirect('/campaigns/view?_id=' + req.body._id) } )
    .catch( err => console.log(err) )  
});

/* GET to the add campaign form */
router.get('/add', (req, res, next) => {    
  res.render('campaigns/edit',{
      title: "Add a Campaign",
      docreate: true,
      key: "", campaign: undefined
  });
});

/* Delete Campaign */
router.get('/delete', (req, res, next) => {
  
  Campaign.deleteOne({
      _id: req.query._id
  })  
  .then( campaign => {
      res.render('campaigns/delete', {
        title: campaign ? campaign.title: "",
        key: req.query._id,
        campaign: campaign
      });
  })
});

/* POST */
router.post('/save', (req,res,next) => {
  if (req.body.docreate === 'create') {
      console.log('Creating a new campaign!')    
      const newCampaign = new Campaign( {
          title: req.body.title,
          desc: req.body.desc,
          goal: req.body.goal,
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