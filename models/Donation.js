const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const DonationSchema = new Schema( {
     rel_id: {
        type: Schema.Types.ObjectId,
        ref: "Campaign"
    },
    user:{
        displayName:{
          type: String,
          default: "Anonymous"
       },
        creator_id: {
          type: String,
       }
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    don_amt: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        default: Date.now
    }
} );

mongoose.model('Donations', DonationSchema);