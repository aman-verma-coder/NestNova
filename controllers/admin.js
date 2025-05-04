const Listing = require("../models/listings.js");

// Render admin dashboard with pending listings
module.exports.renderDashboard = async (req, res) => {
    // Get all pending listings
    const pendingListings = await Listing.find({ status: "pending" }).populate("owner");

    // Get all listings for the admin to view
    const allListings = await Listing.find({}).populate("owner").sort({ status: 1 });

    res.render("admin/dashboard.ejs", { pendingListings, allListings });
};

// Approve a listing
module.exports.approveListing = async (req, res) => {
    const { id } = req.params;

    // Find the pending listing
    const listing = await Listing.findById(id);

    // Create a copy in the main database
    const approvedListing = new Listing(listing.toObject());
    approvedListing.status = "approved";
    await approvedListing.save();

    // Remove from pending database
    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing has been approved and is now visible to users");
    res.redirect("/admin/dashboard");
};

// Reject a listing
module.exports.rejectListing = async (req, res) => {
    const { id } = req.params;

    // Remove from pending database without adding to main database
    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing has been rejected");
    res.redirect("/admin/dashboard");
};

module.exports.pendingListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { status: "pending" });
    req.flash("success", "Listing status set to pending");
    res.redirect("/admin/dashboard");
}