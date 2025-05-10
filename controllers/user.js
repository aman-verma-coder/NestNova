const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    // res.send("All Ok");
    res.render("users/signup.ejs");
};

module.exports.signupPost = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to NestNova");
            res.redirect("/listings");
        })
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.loginPost = async (req, res) => {
    req.flash("success", "Welcome to NestNova! You are now logged in");
    res.redirect(res.locals.redirectUrl || "/listings");
};

module.exports.logoutPost = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have been logged out");
        res.redirect("/listings");
    });
};