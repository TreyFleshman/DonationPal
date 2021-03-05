const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const DonationSchema = new Schema( {
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