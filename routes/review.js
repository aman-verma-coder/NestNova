const express = require("express");
const router = express.Router({ mergeParams: true });//If we want to access the params from the parent router then we need to set mergeParams to true
const mongo_url = 'mongodb://127.0.0.1:27017/wanderlust';
// const Listing = require("../models/listings.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listings.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");

router.post("/", validateReview, wrapAsync(reviewController.postReview));
router.delete("/:reviewid", isLoggedIn, isReviewAuthor, reviewController.destroyReview);

module.exports = router;