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
router.get("/:id/show", wrapAsync(listingController.show));
router
    .route("/new")
    .get(isLoggedIn, listingController.renderNewForm)
    .post(isLoggedIn, upload.single('image'), wrapAsync(listingController.postNewListing));
// .post(upload.single('image'), (req, res) => {
//     res.send(req.file);
// })

router
    .route("/:id/edit")
    .get(isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))
    .put(isLoggedIn, isOwner, upload.single('image'), wrapAsync(listingController.putEditListing));

// router.get("/filter", wrapAsync(listingController.filterListings));

router.delete("/:id/delete", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;