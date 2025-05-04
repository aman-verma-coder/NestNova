const express = require("express");
const router = express.Router();
const Listing = require("../models/listings.js");

router.post('/listings/:id/approve', async (req, res) => {
    try {
        const listing = await Listing.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/listings/:id/reject', async (req, res) => {
    try {
        const listing = await Listing.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isAdmin } = require("../middleware.js");
const adminController = require("../controllers/admin.js");

// Admin dashboard route
router.get("/dashboard", isLoggedIn, isAdmin, wrapAsync(adminController.renderDashboard));

// Approve listing route
router.post("/listings/:id/approve", isLoggedIn, isAdmin, wrapAsync(adminController.approveListing));

// Reject listing route
router.post("/listings/:id/reject", isLoggedIn, isAdmin, wrapAsync(adminController.rejectListing));

module.exports = router;