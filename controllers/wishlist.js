const Wishlist = require('../models/wishlist.js');
const Listing = require('../models/listings.js');
const User = require('../models/user.js');

// Render user's wishlists
module.exports.renderWishlists = async (req, res) => {
    try {
        const wishlists = await Wishlist.find({ user: req.user._id }).populate('listings');
        res.render('users/wishlists/index.ejs', { wishlists });
    } catch (error) {
        req.flash('error', 'Unable to fetch wishlists');
        res.redirect('/listings');
    }
};

// Render create wishlist form
module.exports.renderNewWishlistForm = (req, res) => {
    res.render('users/wishlists/new.ejs');
};

// Create a new wishlist
module.exports.createWishlist = async (req, res) => {
    try {
        const { name, description } = req.body.wishlist;
        const newWishlist = new Wishlist({
            name,
            description,
            user: req.user._id
        });
        await newWishlist.save();
        req.flash('success', 'Successfully created a new wishlist!');
        res.redirect('/wishlists');
    } catch (error) {
        req.flash('error', 'Failed to create wishlist');
        res.redirect('/wishlists/new');
    }
};

// Show a specific wishlist
module.exports.showWishlist = async (req, res) => {
    try {
        const { id } = req.params;
        const wishlist = await Wishlist.findById(id).populate('listings');
        if (!wishlist) {
            req.flash('error', 'Cannot find that wishlist');
            return res.redirect('/wishlists');
        }
        res.render('users/wishlists/show.ejs', { wishlist });
    } catch (error) {
        req.flash('error', 'Something went wrong');
        res.redirect('/wishlists');
    }
};

// Add a listing to wishlist
module.exports.addToWishlist = async (req, res) => {
    try {
        const { wishlistId, listingId } = req.params;
        const wishlist = await Wishlist.findById(wishlistId);

        if (!wishlist) {
            req.flash('error', 'Wishlist not found');
            return res.redirect('/listings');
        }

        // Check if listing already exists in wishlist
        if (wishlist.listings.includes(listingId)) {
            req.flash('info', 'Listing already in wishlist');
        } else {
            wishlist.listings.push(listingId);
            await wishlist.save();
            req.flash('success', 'Added to wishlist!');
        }

        res.redirect(`/listings/${listingId}/show`);
    } catch (error) {
        req.flash('error', 'Failed to add to wishlist');
        res.redirect('/listings');
    }
};

// Remove a listing from wishlist
module.exports.removeFromWishlist = async (req, res) => {
    try {
        const { wishlistId, listingId } = req.params;
        await Wishlist.findByIdAndUpdate(wishlistId, { $pull: { listings: listingId } });
        req.flash('success', 'Removed from wishlist');
        res.redirect(`/wishlists/${wishlistId}`);
    } catch (error) {
        req.flash('error', 'Failed to remove from wishlist');
        res.redirect('/wishlists');
    }
};

// Delete a wishlist
module.exports.deleteWishlist = async (req, res) => {
    try {
        const { id } = req.params;
        await Wishlist.findByIdAndDelete(id);
        req.flash('success', 'Successfully deleted wishlist');
        res.redirect('/wishlists');
    } catch (error) {
        req.flash('error', 'Failed to delete wishlist');
        res.redirect('/wishlists');
    }
};

// Quick add to default wishlist (from listing page)
module.exports.quickAddToWishlist = async (req, res) => {
    try {
        const { listingId } = req.params;

        // Find user's default wishlist or create one
        let wishlist = await Wishlist.findOne({ user: req.user._id, name: 'My Wishlist' });

        if (!wishlist) {
            wishlist = new Wishlist({
                user: req.user._id,
                name: 'My Wishlist',
                description: 'My favorite places'
            });
        }

        // Check if listing already exists in wishlist
        if (wishlist.listings.includes(listingId)) {
            req.flash('info', 'Listing already in wishlist');
        } else {
            wishlist.listings.push(listingId);
            await wishlist.save();
            req.flash('success', 'Added to wishlist!');
        }

        res.redirect(`/listings/${listingId}/show`);
    } catch (error) {
        req.flash('error', 'Failed to add to wishlist');
        res.redirect('/listings');
    }
};