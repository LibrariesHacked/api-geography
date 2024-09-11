const express = require('express')
const router = express.Router()
const cache = require('../middleware/cache')

const lsoaModel = require('../models/lsoa')

/**
 * Get UK aggregated small areas (as GeoJson)
 */
router.get('/smallareas', cache(86400), async (req, res) => {
  const lsoas = await lsoaModel.getSmallAreas()
  return res.json(lsoas)
})

/**
 * Get LSOA stats by library authority
 */
router.get(
  '/smallareas/libraryauthority/:code',
  cache(86400),
  async (req, res) => {
    const lsoas = await lsoaModel.getSmallAreasByLibraryAuthorityCode(
      req.params.code
    )
    return res.json(lsoas)
  }
)

/**
 * Get a single LSOA
 */
router.get('/:lsoa', cache(86400), async (req, res) => {
  const fields = req.query.fields || []
  const lsoaCode = req.params.lsoa
  const lsoa = await lsoaModel.getLsoa(fields, lsoaCode)
  if (!lsoa || Object.keys(lsoa).length === 0) {
    return res.status(404).json({ error: 'LSOA not found' })
  }
  return res.json(lsoa)
})

/**
 * Get LSOA tiles
 */
router.get('/:z/:x/:y.mvt', cache(86400), async (req, res) => {
  const { z, x, y } = req.params
  if (z < 0 || z > 14) {
    return res.status(400).json({ error: 'Invalid zoom level' })
  }
  if (x < 0 || x >= Math.pow(2, z)) {
    return res.status(400).json({ error: 'Invalid x coordinate' })
  }
  if (y < 0 || y >= Math.pow(2, z)) {
    return res.status(400).json({ error: 'Invalid y coordinate' })
  }
  const tile = await lsoaModel.getLsoaTile(x, y, z)
  if (!tile) return res.status(204).send(null)
  res.setHeader('Content-Type', 'application/x-protobuf')
  res.send(tile)
})

module.exports = router
