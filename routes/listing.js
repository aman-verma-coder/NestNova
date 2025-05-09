const express = require("express");
const router = express.Router();
const mongo_url = 'mongodb://127.0.0.1:27017/wanderlust';
const Listing = require("../models/listings.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });

router.get("/", wrapAsync(listingController.index));
router.get("/search", wrapAsync(listingController.searchListings));
router.get("/:id/show", wrapAsync(listingController.show));
router
    .route("/new")
    .get(isLoggedIn, listingController.renderNewForm)
    .post(isLoggedIn, upload.single('image'), wrapAsync(listingController.postNewListing));

// Ensure new listings are saved with pending status by default
router.post("/new", isLoggedIn, upload.single('image'), wrapAsync(async (req, res) => {
    req.body.listing.status = "pending";
    await listingController.postNewListing(req, res);
    req.flash('success', 'Your listing has been submitted for admin review and will be visible after approval.');
}));
// .post(upload.single('image'), (req, res) => {
//     res.send(req.file);
// })

router
    .route("/:id/edit")
    .get(isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))
    .put(isLoggedIn, isOwner, upload.single('image'), wrapAsync(listingController.putEditListing));

// router.get("/filter", wrapAsync(listingController.filterListings));

router.delete("/:id/delete", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//about page
router.get("/about", (req, res) => {
    res.render("./pages/about.ejs");
})

module.exports = router;