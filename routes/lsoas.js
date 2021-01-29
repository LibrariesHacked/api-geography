const express = require('express')
const router = express.Router()
const cache = require('../middleware/cache')

const lsoaModel = require('../models/lsoa')

/**
 * Get a single lsoa
 */
router.get('/:lsoa', cache(86400), (req, res) => {
  lsoaModel.getLsoa(req.params.lsoa).then(lsoa => res.json(lsoa))
})

/**
 * Get LSOA tiles
 */
router.get('/:z/:x/:y.mvt', cache(86400), async (req, res) => {
  const { z, x, y } = req.params

  const tile = await lsoaModel.getLsoaTile(x, y, z)
  res.setHeader('Content-Type', 'application/x-protobuf')
  if (!tile) return res.status(204).send(null)
  res.send(tile)
})

module.exports = router
