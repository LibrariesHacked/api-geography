const express = require('express');
const router = express.Router();

const postcodeModel = require('../models/postcode');

/**
 * Gets LSOAs from postcodes
 */
router.post('/lsoas', (req, res) => {
    // The filter must be either area/sector/district
    const filter = req.query.filter;
    if (filter === 'area') {
        postcodeModel.getPostcodeLsoasFromSectors(req.body).then(postcodes => res.json(postcodes));
    } else if (filter === 'district') {
        postcodeModel.getPostcodeLsoasFromSectors(req.body).then(postcodes => res.json(postcodes));
    } else if (filter === 'sector') {
        postcodeModel.getPostcodeLsoasFromSectors(req.body).then(postcodes => res.json(postcodes));
    } else {
        res.json([])
    }
});

/**
 * Gets a single postcode
 */
router.get('/:postcode', (req, res) => {
    postcodeModel.getPostcode(req.params.postcode).then(postcode => res.json(postcode));
});



module.exports = router;