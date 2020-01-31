const express = require('express');
const router = express.Router();

const lsoaModel = require('../models/lsoa');

/**
 * Get a single lsoa
 */
router.get('/:lsoa', (req, res) => {
    lsoaModel.getLsoa(req.params.lsoa).then(lsoa => res.json(lsoa));
});

/** 
 * Get LSOA tiles
 */
router.get('/:z/:x/:y.mvt', async (req, res) => {
	const { z, x, y } = req.params;
	lsoaModel.getTileData(x, y, z).then(tile => {
		res.setHeader('Content-Type', 'application/x-protobuf');
		if (!tile) return res.status(204).send(null);
		res.send(tile);
	});
});

module.exports = router;