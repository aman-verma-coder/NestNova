const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userActivitySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    viewedListings: [{
        listing: {
            type: Schema.Types.ObjectId,
            ref: 'Listing'
        },
        viewCount: {
            type: Number,
            default: 1
        },
        lastViewed: {
            type: Date,
            default: Date.now
        }
    }],
    searchQueries: [{
        query: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    preferredCategories: [{
        category: String,
        weight: {
            type: Number,
            default: 1
        }
    }],
    preferredLocations: [{
        location: String,
        weight: {
            type: Number,
            default: 1
        }
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Update the lastUpdated timestamp before saving
userActivitySchema.pre('save', function (next) {
    this.lastUpdated = Date.now();
    next();
});

module.exports = mongoose.model('UserActivity', userActivitySchema);