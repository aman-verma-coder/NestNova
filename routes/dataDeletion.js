const express = require('express');
const router = express.Router();

// Route for the data deletion page
router.get('/data-deletion', (req, res) => {
    res.render('dataDeletion.ejs'); // Explicitly specify the file extension
});

module.exports = router;