const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CampaignSchema = new Schema( {
    creator_id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true,
        trim: true
    },
    goal: {
        type: Number,
        required: true
    },
    progress: {
        type: Number,
        default: 0
    },
    progressBar: {
        type: Number,
        default: 0
    },    
    start_date: {
        type: String,
        required: true,
        default: Date.now
    },
    end_date: {
        type: String,
    }
} );

mongoose.model('Campaigns', CampaignSchema);