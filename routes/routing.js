const express = require('express')
const router = express.Router()

const routingModel = require('../models/routing')

/**
 * Get an isochrone for a location
 */
router.get('/isochrone/:transport', async (req, res) => {
  const isochrone = await routingModel.getIsochrone(req.params.transport, req.query.longitude, req.query.latitude, req.query.location)
  res.json(isochrone)
})

module.exports = router
