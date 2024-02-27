const express = require('express')
const router = express.Router()
const cache = require('../middleware/cache')

const authModel = require('../models/libraryAuthority')

/**
 * Get all library authorities
 */
router.get('/', cache(86400), async (req, res) => {
  const fields = req.query.fields || []
  const latitude = req.query.latitude
  const longitude = req.query.longitude
  const location = longitude && latitude ? [longitude, latitude] : null
  const geo = req.query.geo || false
  const bbox = req.query.bbox || false
  const auth = await authModel.getLibraryAuthorities(
    fields,
    location,
    geo,
    bbox
  )
  if (!auth || Object.keys(auth).length === 0) return res.status(404).send(null)
  return res.json(auth)
})

/**
 * Get a single library authority
 */
router.get('/:code', cache(86400), async (req, res) => {
  const fields = req.query.fields || []
  const authCode = req.params.code
  const geo = req.query.geo || false
  const bbox = req.query.bbox || false
  const auth = await authModel.getLibraryAuthorityByCode(
    fields,
    authCode,
    geo,
    bbox
  )
  if (!auth || Object.keys(auth).length === 0) return res.status(404).send(null)
  return res.json(auth)
})

/**
 * Get a single library authority by name
 */
router.get('/name/:name', cache(86400), async (req, res) => {
  const fields = req.query.fields || []
  const authName = req.params.name
  const auth = await authModel.getLibraryAuthorityByName(fields, authName)
  if (!auth || Object.keys(auth).length === 0) return res.status(404).send(null)
  return res.json(auth)
})

/**
 * Get library authority tiles
 */
router.get('/:z/:x/:y.mvt', cache(86400), async (req, res) => {
  const { z, x, y } = req.params
  const tile = await authModel.getLibraryAuthorityTile(x, y, z)
  if (!tile) return res.status(204).send(null)
  res.setHeader('Content-Type', 'application/x-protobuf')
  res.send(tile)
})

module.exports = router
