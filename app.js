if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}
// console.log(process.env) // remove this after you've confirmed it is working
const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
// const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
const dbURL = process.env.ATLAS_DB_URL;
const Listing = require("./models/listings.js");
const Review = require("./models/review.js");
const path = require("path");
var methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const footerRouter = require("./routes/footer.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocaStrategy = require('passport-local');
const User = require('./models/user.js');


main()
    .then(() => { console.log("Connected to DB") })
    .catch((err) => { console.log(err) });

// function connectToDatabase() {
//     return mongoose.connect(dbURL);
// }

async function main() {
    await mongoose.connect(dbURL);
}

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);
app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 60 * 60
});

store.on("error", () => {
    console.log("Error in MongoStore", err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.get("/", (req, res) => {
    res.redirect("/listings");
});

// function getObjectKey(object) {
//     for (let prop in object) {
//         if (object.hasOwnProperty(prop)) {
//             return prop;
//         }
//     }
// }

// app.get("/listings/filter", (req, res) => {
//     let filter = req.query;
//     let objKey = getObjectKey(filter);
//     req.locals.filter = objKey;
//     console.log(objKey);
//     res.redirect("/listings", { objKey: objKey });
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocaStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    console.log(error);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    console.log(error);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// app.get("/register", async (req, res) => {
//     let fakeUser = new User({
//         email: "abcde@gmail.com",
//         username: "abcde",
//     });
//     let newUser = await User.register(fakeUser, "abcd12@");
//     res.send(newUser);
// })

app.use("/listings", listingRouter);
app.use("/listings/:id/review", reviewRouter);
app.use("/", footerRouter);
app.use("/", userRouter);

// app.get("/listings", wrapAsync(async (req, res) => {
//     let allListings = await Listing.find({});
//     res.render("listings/index.ejs", { allListings });
// }))

// app.get("/listings/:id/show", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let showData = await Listing.findById(id).populate("review");
//     console.log(showData);
//     res.render("listings/show.ejs", { showData });
// }))

// app.get("/listings/new", (req, res) => {
//     res.render("listings/newListing.ejs");
// })

// app.post("/listings/new", validateListing, wrapAsync(async (req, res, next) => {
//     const newListing = new Listing(req.body);
//     await newListing.save();
//     res.redirect("/listings");
// }))

// app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     console.log(id);
//     let editNeeded = await Listing.findById(id);
//     console.log(editNeeded);
//     res.render("listings/editListingData.ejs", { editNeeded });
// }))

// app.put("/listings/:id/edit", validateListing, wrapAsync(async (req, res) => {
//     let updatedData = await req.body;
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...updatedData });
//     console.log(`Updated ID: ${id}`);
//     console.log(updatedData);
//     res.redirect("/listings");
// }))

// app.delete("/listings/:id/delete", wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     console.log(`Element to be deleted's ID: ${id}`);
//     await Listing.findByIdAndDelete(id);
//     res.redirect("/listings");
// }))

// app.post("/listings/:id/review", validateReview, wrapAsync(async (req, res) => {
//     let reviewid = req.params.id;
//     let listingData = await Listing.findById(reviewid);
//     let newReview = new Review(req.body.review);
//     console.log(newReview);
//     listingData.review.push(newReview);
//     await newReview.save();
//     await listingData.save();
//     console.log("All Ok");
//     // console.log(listingData);
//     // listingData.save();
//     // console.log(listingData);
//     // console.log(listingData);
//     res.redirect(`/listings/${reviewid}/show`);
// }))

// app.delete("/listings/:id/review/:reviewid", async (req, res) => {
//     let { id, reviewid } = req.params;
//     console.log(`Post ID: ${id}, Review ID: ${reviewid}`)
//     // await Listing.findByIdAndUpdate(id, { $pull: { review: reviewid } });
//     // await Review.findByIdAndDelete(reviewid).then(() => {
//     //     console.log(`Deleted ID: ${reviewid}`);
//     //     res.redirect(`/listings/${id}/show`);
//     // })
//     res.send("All Ok");
// })

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.render("error.ejs", { statusCode, message });
    // res.status(statusCode).send(message);
});

app.listen(port, () => {
    console.log(`Server is listening to ${port}`);
})

module.exports = {
    main,
};