const express = require('express');
const router = express.Router();
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const auditLogger = require('../utils/auditLogger');

// Google OAuth Routes
router.get('/auth/google',
    saveRedirectUrl,
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login',
        failureFlash: true
    }),
    async (req, res) => {
        // Log the login action
        await auditLogger.log({
            user: req.user.username,
            action: "login",
            resourceType: "user",
            resourceId: req.user._id.toString(),
            ipAddress: req.ip,
            status: "success",
            details: { method: "google", browser: req.headers["user-agent"] }
        });

        req.flash('success', 'Welcome to NestNova! You are now logged in with Google');
        res.redirect(res.locals.redirectUrl || '/listings');
    }
);

// Facebook OAuth Routes
router.get('/auth/facebook',
    saveRedirectUrl,
    passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/login',
        failureFlash: true
    }),
    async (req, res) => {
        // Log the login action
        await auditLogger.log({
            user: req.user.username,
            action: "login",
            resourceType: "user",
            resourceId: req.user._id.toString(),
            ipAddress: req.ip,
            status: "success",
            details: { method: "facebook", browser: req.headers["user-agent"] }
        });

        req.flash('success', 'Welcome to NestNova! You are now logged in with Facebook');
        res.redirect(res.locals.redirectUrl || '/listings');
    }
);

// Twitter OAuth Routes
router.get('/auth/twitter',
    saveRedirectUrl,
    passport.authenticate('twitter')
);

router.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
        failureRedirect: '/login',
        failureFlash: true
    }),
    async (req, res) => {
        // Log the login action
        await auditLogger.log({
            user: req.user.username,
            action: "login",
            resourceType: "user",
            resourceId: req.user._id.toString(),
            ipAddress: req.ip,
            status: "success",
            details: { method: "twitter", browser: req.headers["user-agent"] }
        });

        req.flash('success', 'Welcome to NestNova! You are now logged in with Twitter');
        res.redirect(res.locals.redirectUrl || '/listings');
    }
);

module.exports = router;