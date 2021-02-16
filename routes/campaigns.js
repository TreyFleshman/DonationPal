var express = require('express');
var router = express.Router();
const campaigns = require('../models/campaigns-memory');

/* GET listing of all campaigns */
router.get('/', async function(req, res, next) {

  let keylist = await campaigns.keylist();
  let keyPromise = keylist.map( key => {
      return campaigns.read(key);
  });

  let campaignlist = await Promise.all(keyPromise);
  

  res.render('campaigns/index', { title: "Campaigns", campaignlist: campaignlist });
});

/* GET sinlge campaign. */
router.get('/view', async function(req, res, next) {
  var campaign = await campaigns.read(req.query.key);
  res.render('campaigns/view', { title: campaign.title, campaignkey: campaign.key, fund_amt: campaign.fund_amt,min_don: campaign.min_don, desc: campaign.desc });
});

/* GET to the add campaign form */
router.get('/add', function(req, res, next){
  res.render('campaigns/edit', { title: "Add a Campaign" });
});

/* POST to a add a new campaign */
router.post('/save', async (req, res, next) => {
  // logic to save a new campaign.

  var campaign;
  campaign = await campaigns.create(req.body.key, req.body.title, req.body.fund_amt, req.body.min_don, req.body.desc);
  res.redirect('/campaigns/view?key=' + req.body.key);
  console.log("Saving a new campaign.");
});

module.exports = router;