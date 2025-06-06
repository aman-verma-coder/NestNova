const express = require("express");
const router = express.Router();
const mongo_url = 'mongodb://127.0.0.1:27017/wanderlust';
const wrapAsync = require("../utils/wrapAsync.js");

router.get("/tnc", (req, res) => {
    res.render("./pages/tnc.ejs");
});
router.get("/privacy", (req, res) => {
    res.render("./pages/privacy.ejs");
});
router.get("/rnc", (req, res) => {
    res.render("./pages/rnc.ejs");
});
router.get("/contact", (req, res) => {
    res.render("./pages/contact.ejs");
});
router.get("/sitemap", (req, res) => {
    res.render("./pages/sitemap.ejs");
});
router.get("/blog", (req, res) => {
    res.render("./pages/blog.ejs");
});
module.exports = router;