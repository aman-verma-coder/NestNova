const Listing = require("../models/listings.js");
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });

// Search functionality
module.exports.searchListings = async (req, res) => {
    const { q } = req.query;
    if (!q || q.trim() === "") {
        return res.redirect("/listings");
    }

    // Search in title, description, location and country fields
    const allListings = await Listing.find({
        $or: [
            { title: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } },
            { location: { $regex: q, $options: "i" } },
            { country: { $regex: q, $options: "i" } },
            { category: { $regex: q, $options: "i" } }
        ]
    });

    res.render("listings/index.ejs", { allListings, searchQuery: q });
};

function getObjectKey(object) {
    for (let prop in object) {
        if (object.hasOwnProperty(prop)) {
            return prop;
        }
    }
}
module.exports.index = async (req, res) => {
    if (getObjectKey(req.query)) {
        let allListings = await Listing.find({ category: { $in: getObjectKey(req.query) } });
        console.log(allListings);
        res.render("listings/index.ejs", { allListings });
        // res.send("All Ok");
    }
    else {
        let allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
        // res.send("Not Ok");
    }
};

module.exports.show = async (req, res) => {
    let { id } = req.params;
    let showData = await Listing.findById(id)
        .populate({ path: "review", populate: { path: "author" } })
        .populate("owner");
    // console.log(`Show Data${showData}`);
    if (!showData) {
        req.flash("error", "Listing Does not exist");
        res.redirect("/listings");
    }
    // console.log(showData.geometry.coordinates);
    console.log(showData);
    res.render("listings/show.ejs", { showData });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/newListing.ejs");
};

module.exports.postNewListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.location,
        limit: 2
    })
        .send();
    // console.log(req.body.location);
    // console.log(response.body.features[0].geometry);
    // res.send("All Ok");
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url, "..", filename);
    const newListing = new Listing(req.body);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Added");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    console.log(id);
    let editNeeded = await Listing.findById(id);
    console.log(`Data to be edited: ${editNeeded}`);
    if (!editNeeded) {
        req.flash("error", "Listing Does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl = editNeeded.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/editListingData.ejs", { editNeeded, originalImageUrl });
};

module.exports.putEditListing = async (req, res) => {
    let updatedData = req.body;
    let { id } = req.params;
    let editNeeded = await Listing.findByIdAndUpdate(id, { ...updatedData });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        editNeeded.image = { url, filename };
        await editNeeded.save();
    }
    // console.log(`Updated ID: ${id}`);
    // console.log(`Updated Data: ${updatedData}`);
    console.log(`Updated Data: ${editNeeded}`);
    req.flash("success", "Listing Edited");
    res.redirect(`/listings/${id}/show`);
    // res.send("All Ok");
};

// module.exports.filterListings = (req, res) => {
//     let filter = req.body;
//     console.log(filter);
//     res.send("All Ok");
// };

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    console.log(`Element to be deleted's ID: ${id}`);
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
    // res.send("All Ok");
};