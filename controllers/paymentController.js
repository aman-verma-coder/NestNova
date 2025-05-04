const Razorpay = require('razorpay');
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;
const Listing = require('../models/listings');

const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_ID_KEY,
    key_secret: RAZORPAY_SECRET_KEY
});

const renderProductPage = async (req, res) => {

    try {

        res.render('product');

    } catch (error) {
        console.log(error.message);
    }

}

const createOrder = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send({ success: false, msg: 'Please login to continue' });
        }

        const amount = req.body.amount * 100;
        const options = {
            amount: amount,
            currency: 'INR',
            receipt: req.user.email,
            notes: {
                listingId: req.body.listingId,
                userId: req.user._id
            }
        }

        razorpayInstance.orders.create(options,
            (err, order) => {
                if (!err) {
                    res.status(200).send({
                        success: true,
                        msg: 'Order Created',
                        order_id: order.id,
                        amount: amount,
                        key_id: RAZORPAY_ID_KEY,
                        product_name: req.body.name,
                        description: req.body.description,
                        contact: req.user.phone || '',
                        name: req.user.username,
                        email: req.user.email
                    });
                } else {
                    res.status(400).send({ success: false, msg: 'Something went wrong!' });
                }
            }
        );

    } catch (error) {
        console.log(error.message);
    }
}

const handlePaymentSuccess = async (req, res) => {
    try {
        const { paymentId, orderId, listingId } = req.body;

        if (!paymentId || !orderId || !listingId) {
            return res.status(400).send({ success: false, msg: 'Missing required parameters' });
        }

        // Get listing details
        const listing = await Listing.findById(listingId).populate('owner');
        if (!listing) {
            return res.status(404).send({ success: false, msg: 'Listing not found' });
        }

        // Create booking object with available information
        const booking = {
            paymentId,
            orderId,
            amount: listing.price * 100, // Convert to paise for consistency
            checkIn: new Date().toLocaleDateString(), // Default to today
            checkOut: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(), // Default to 7 days from now
            guests: 2 // Default value
        };

        // In a real application, you would save this booking to a database

        // Redirect to the booking success page
        return res.status(200).json({
            success: true,
            redirectUrl: `/booking-success?paymentId=${paymentId}&listingId=${listingId}&orderId=${orderId}`
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({ success: false, msg: 'Server error' });
    }
}

const renderBookingSuccess = async (req, res) => {
    try {
        const { paymentId, listingId, orderId } = req.query;

        if (!paymentId || !listingId || !orderId) {
            req.flash('error', 'Missing booking information');
            return res.redirect('/listings');
        }

        // Get listing details
        const listing = await Listing.findById(listingId).populate('owner');
        if (!listing) {
            req.flash('error', 'Listing not found');
            return res.redirect('/listings');
        }

        // Create booking object with available information
        const booking = {
            paymentId,
            orderId,
            amount: listing.price * 100, // Convert to paise for consistency
            checkIn: new Date().toLocaleDateString(), // Default to today
            checkOut: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(), // Default to 7 days from now
            guests: 2 // Default value
        };

        // Render the booking success page with all necessary information
        res.render('listings/booking-success.ejs', {
            listing,
            booking,
            paymentId,
            currentUser: req.user // Pass the currentUser to the template
        });
    } catch (error) {
        console.log(error.message);
        req.flash('error', 'Failed to load booking details');
        res.redirect('/listings');
    }
}

module.exports = {
    renderProductPage,
    createOrder,
    handlePaymentSuccess,
    renderBookingSuccess
}