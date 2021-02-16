const _campaign_key = Symbol('key');
const _campaign_title = Symbol('title');
const _campaign_fund_amt = Symbol('fund_amt');
const _campaign_min_don = Symbol('min_don');
const _campaign_desc = Symbol('desc');
// const _campaign_photos = Symbol('photos');

module.exports = class Note {
  
  constructor(key, title, fund_amt, min_don, desc ) {
      this[_campaign_key] = key;
      this[_campaign_title] = title;
      this[_campaign_fund_amt] = fund_amt;
      this[_campaign_min_don] = min_don;
      this[_campaign_desc] = desc;
  }

  //Getters & setters
  get key() { return this[_campaign_key]; }
  get title() { return this[_campaign_title]; }
  get fund_amt() { return this[_campaign_fund_amt]; }
  get min_don() { return this[_campaign_min_don]; }
  get desc() { return this [_campaign_desc]; }


  set key(newKey) { this[_campaign_key]; }
  set title(newTitle) { this[_campaign_title]; }
  set fund_amt(newFund_amt) { this[_campaign_fund_amt]; }
  set min_don(newMin_don) { this[_campaign_min_don]; }
  set desc(newDesc) { [this_campaign_desc]; }

};