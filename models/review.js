const { number } = require("joi");
const mongoose = require("mongoose");
const schema = mongoose.Schema;

const reviewSchema = new schema({
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    },
    author: {
        type: schema.Types.ObjectId,
        ref: "User"
    },
    listingId: {
        type: schema.Types.ObjectId,
        ref: "Listing"
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;