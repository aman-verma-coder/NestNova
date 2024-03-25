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
    }
});

listingSchemes.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
})

const Listing = mongoose.model("Listing", listingSchemes);
module.exports = Listing;