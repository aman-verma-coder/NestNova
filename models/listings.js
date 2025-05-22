const { number } = require("joi");
const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchemes = new schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: String,
        filename: String
    },
    price: Number,
    location: String,
    country: String,
    review: [
        {
            type: schema.Types.ObjectId,
            ref: "Review"
        },
    ],
    owner: {
        type: schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {      //This is geojson object format
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    category: {
        type: String,
        enum: ["Trending", "Rooms", "Bed & Breakfast", "Beaches", "Pools", "Iconic Cities", "Mountains", "Castles", "Camping", "Farms", "Arctic"],
        required: true
    },
    amenities: {
        type: [String],
        enum: ["Wifi", "Kitchen", "Air Conditioning", "Free Parking", "Swimming Pool"],
        default: []
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }
});

module.exports = mongoose.model("Listing", listingSchemes);