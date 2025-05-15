const User = require("../models/user.js");
const auditLogger = require("../utils/auditLogger.js");

module.exports.renderSignupForm = (req, res) => {
    // res.send("All Ok");
    res.render("users/signup.ejs");
};

module.exports.signupPost = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        
        // Log the registration action
        await auditLogger.log({
            user: registeredUser.username,
            action: "register",
            resourceType: "user",
            resourceId: registeredUser._id.toString(),
            ipAddress: req.ip,
            status: "success",
            details: { email: registeredUser.email }
        });
        
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
    // Log the login action
    await auditLogger.log({
        user: req.user.username,
        action: "login",
        resourceType: "user",
        resourceId: req.user._id.toString(),
        ipAddress: req.ip,
        status: "success",
        details: { browser: req.headers["user-agent"] }
    });
    
    req.flash("success", "Welcome to NestNova! You are now logged in");
    res.redirect(res.locals.redirectUrl || "/listings");
};

module.exports.logoutPost = (req, res, next) => {
    // Store user info before logout for audit logging
    const username = req.user.username;
    const userId = req.user._id.toString();
    
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        
        // Log the logout action
        auditLogger.log({
            user: username,
            action: "logout",
            resourceType: "user",
            resourceId: userId,
            ipAddress: req.ip,
            status: "success"
        }).catch(err => console.error("Error logging logout:", err));
        
        req.flash("success", "You have been logged out");
        res.redirect("/listings");
    });
};