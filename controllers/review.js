const Listing = require("../models/listings.js");
const Review = require("../models/review.js");

module.exports.postReview = async (req, res) => {
    let listingid = req.body.id;
    console.log(listingid);
    let listingData = await Listing.findById(listingid);
    console.log(listingData);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    newReview.listingId = listingid; // Save reference to the listing
    newReview.status = "pending"; // Set status as pending by default
    console.log(newReview);
    listingData.review.push(newReview);
    await newReview.save();
    await listingData.save();
    // console.log("All Ok");
    // // console.log(listingData);
    // // listingData.save();
    // // console.log(listingData);
    // // console.log(listingData);
    req.flash("success", "Thank you for your review! It will be visible after approval.");
    res.redirect(`/listings/${listingid}/show`);
    // res.send("All Ok");
};

module.exports.destroyReview = async (req, res) => {
    let { id } = req.params;
    let { reviewid } = req.params;
    let listingpost = await Listing.findOne({ review: reviewid });
    console.log(`Post ID: ${id}, Review ID: ${reviewid}`);
    console.log(`Listing Post: ${listingpost}`);
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewid } });
    await Review.findByIdAndDelete(reviewid).then(() => {
        console.log(`Deleted ID: ${reviewid}`);
        req.flash("success", "Review Deleted");
        res.redirect(`/listings/${id}/show`);
    })
    // res.send("All Ok");
};