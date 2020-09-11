const express = require('express')
const router = express.Router()
const cache = require('../middleware/cache')

const libraryAuthorityModel = require('../models/libraryAuthority')

/**
 * Get all library authorities
 */
router.get('/', cache(3600), (req, res) => {
  libraryAuthorityModel.getLibraryAuthorities().then(authorities => res.json(authorities))
})

/**
 * Get a single library authority
 */
router.get('/:code', cache(3600), (req, res) => {
  libraryAuthorityModel.getLibraryAuthority(req.params.code).then(libraryAuthority => res.json(libraryAuthority))
})

/**
 * Get library authority tiles
 */
router.get('/:z/:x/:y.mvt', cache(3600), async (req, res) => {
  const { z, x, y } = req.params
  libraryAuthorityModel.getLibraryAuthorityTile(x, y, z).then(tile => {
    res.setHeader('Content-Type', 'application/x-protobuf')
    if (!tile) return res.status(204).send(null)
    res.send(tile)
  })
})

module.exports = router
