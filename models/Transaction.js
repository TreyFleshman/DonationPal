const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const TransactionSchema = new Schema( {
     rel_campaign_id: {
        type: Schema.Types.ObjectId,
        ref: "Campaign"
    },
    rel_donation_id:{
        type: Schema.Types.ObjectId,
        ref: "Donation"
    },
    creator_id: {
        type: String,
        required: true
    },
    don_amt: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        default: Date.now
    },
    charge: {
        type: Object
    },
    customer:{
        type: Object
    }
} );

mongoose.model('Transactions', TransactionSchema);