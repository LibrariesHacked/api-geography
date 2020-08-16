const express = require('express')
const router = express.Router()
const cache = require('../middleware/cache')

const routingModel = require('../models/routing')

/**
 * Get an isochrone for a location
 */
router.get('/isochrone/:transport', cache(3600), async (req, res) => {
  const isochrone = await routingModel.getIsochrone(req.params.transport, req.query.longitude, req.query.latitude, req.query.location)
  res.json(isochrone)
})

module.exports = router
