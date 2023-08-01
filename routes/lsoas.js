const express = require('express')
const router = express.Router()
const cache = require('../middleware/cache')

const lsoaModel = require('../models/lsoa')

/**
 * Get a single LSOA
 */
router.get('/:lsoa', cache(86400), (req, res) => {
  const fields = req.query.fields || []
  const lsoaCode = req.params.lsoa
  const lsoa = lsoaModel.getLsoa(fields, lsoaCode)
  if (!lsoa || Object.keys(lsoa).length === 0) return res.status(404).send(null)
  return res.json(lsoa)
})

/**
 * Get LSOA tiles
 */
router.get('/:z/:x/:y.mvt', cache(86400), async (req, res) => {
  const { z, x, y } = req.params
  if (!tile) return res.status(204).send(null)
  const tile = await lsoaModel.getLsoaTile(x, y, z)
  res.setHeader('Content-Type', 'application/x-protobuf')
  res.send(tile)
})

module.exports = router
