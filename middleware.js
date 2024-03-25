const Listing = require("./models/listings.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.user);
    // console.log(req.path, "..", req.originalUrl);
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        console.log(req.session.redirectUrl);
        req.flash("error", "You must be signed in");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let editNeededListing = await Listing.findById(id);
    if (!editNeededListing.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", "You don't have permission to perform this action");
        console.log(`Is owner middleware ${id}`);
        return res.redirect(`/listings/${id}/show`);
    }
    next();
};
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewid } = req.params;
    let delReview = await Review.findById(reviewid);
    if (!delReview.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the author of this review");
        console.log(`Is owner middleware ${id}`);
        return res.redirect(`/listings/${id}/show`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    console.log(error);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    console.log(error);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};