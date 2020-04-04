const express = require('express');
const router = express.Router();

const libraryAuthorityModel = require('../models/libraryAuthority');

/**
 * Get a single library authority
 */
router.get('/:code', (req, res) => {
    libraryAuthorityModel.getLibraryAuthority(req.params.code).then(library_authority => res.json(library_authority));
});

/** 
 * Get library authority tiles
 */
router.get('/:z/:x/:y.mvt', async (req, res) => {
	const { z, x, y } = req.params;
	libraryAuthorityModel.getLibraryAuthorityTile(x, y, z).then(tile => {
		res.setHeader('Content-Type', 'application/x-protobuf');
		if (!tile) return res.status(204).send(null);
		res.send(tile);
	});
});

module.exports = router;