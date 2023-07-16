const express = require('express')
const router = express.Router()
const cache = require('../middleware/cache')

const buaModel = require('../models/builtUpAreas')

/**
 * Get a single built up area
 */
router.get('/:builtuparea', cache(86400), async (req, res) => {
  const fields = req.query.fields || []
  const builtuparea = await buaModel.getBuiltUpArea(fields, req.params.builtuparea)
  if (!builtuparea || Object.keys(builtuparea).length === 0)
    return res.status(404).send(null)
  return res.json(builtuparea)
})

/**
 * Get built up area tiles
 */
router.get('/:z/:x/:y.mvt', cache(86400), async (req, res) => {
  const { z, x, y } = req.params

  const tile = await bua.getBuiltUpAreasTile(x, y, z)
  res.setHeader('Content-Type', 'application/x-protobuf')
  if (!tile) return res.status(204).send(null)
  res.send(tile)
})

module.exports = router
