const express = require('express');
const router = express.Router();

const postcodeModel = require('../models/postcode');

/**
 * Gets a single postcode
 */
router.get('/:postcode', (req, res) => {
    postcodeModel.getPostcode(req.params.postcode).then(postcode => res.json(postcode));
});

/**
 * Gets LSOAs from postcodes
 */
router.post('/lsoas', (req, res) => {
    res.setTimeout(600000);
    // The filter must be either area/sector/district
    const filter = req.query.filter;
    if (filter === 'area') {
        res.json([]);
    } else if (filter === 'district') {
        res.json([]);
    } else if (filter === 'sector') {
        postcodeModel.getPostcodeLsoasFromSectors(req.body).then(lsoas => res.json(lsoas));
    } else {
        res.json([]);
    }
});

module.exports = router;