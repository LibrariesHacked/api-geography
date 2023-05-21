const express = require('express')
const router = express.Router()
const cache = require('../middleware/cache')

const libraryAuthorityModel = require('../models/libraryAuthority')

/**
 * Get all library authorities
 */
router.get('/', cache(86400), (req, res) => {
  const fields = req.query.fields || []
  const location =
    req.query.longitude && req.query.latitude
      ? [req.query.longitude, req.query.latitude]
      : null
  libraryAuthorityModel
    .getLibraryAuthorities(fields, location)
    .then(authorities => res.json(authorities))
})

/**
 * Get a single library authority
 */
router.get('/:code', cache(86400), (req, res) => {
  const fields = req.query.fields || []
  libraryAuthorityModel
    .getLibraryAuthorityByCode(fields, req.params.code)
    .then(libraryAuthority => res.json(libraryAuthority))
})

/**
 * Get a single library authority by name
 */
router.get('/name/:name', cache(86400), (req, res) => {
  const fields = req.query.fields || []
  libraryAuthorityModel
    .getLibraryAuthorityByName(fields, req.params.name)
    .then(libraryAuthority => res.json(libraryAuthority))
})

/**
 * Get library authority tiles
 */
router.get('/:z/:x/:y.mvt', cache(86400), async (req, res) => {
  const { z, x, y } = req.params
  libraryAuthorityModel.getLibraryAuthorityTile(x, y, z).then(tile => {
    res.setHeader('Content-Type', 'application/x-protobuf')
    if (!tile) return res.status(204).send(null)
    res.send(tile)
  })
})

module.exports = router
