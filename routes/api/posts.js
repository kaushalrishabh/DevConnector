const express = require('express');
const router = express.Router();

// @Route   GET api/posts
// @desc    Test route
// @access  Public

router.get('/', (req, res) => res.send('Post route'));

module.exports = router;