const express = require('express')
const router = express.Router()
const cache = require('../middleware/cache')

const postcodeModel = require('../models/postcode')

/**
 * Gets a single postcode by lng/lat
 * @query {*} lng A longitude to retrieve data for
 * @query {*} lat A latitude to retrieve data for
 * @returns {*} postcodeData An object containing the postcode data
 */
router.get('/', cache(86400), async (req, res) => {
  if (!req.query.lng || !req.query.lat) return res.json({})
  const postcodeData = await postcodeModel.getPostcodeFromLngLat(
    req.query.lng,
    req.query.lat
  )
  return res.json(postcodeData)
})

/**
 * Gets a single postcode by postcode
 */
router.get('/:postcode', cache(86400), async (req, res) => {
  if (!req.params.postcode) return res.json({})
  const postcodeData = await postcodeModel.getPostcode(req.params.postcode)
  return res.json(postcodeData)
})

/**
 * Gets LSOAs from postcodes
 */
router.post('/lsoas', (req, res) => {
  res.setTimeout(600000)
  // The filter must be either area/sector/district
  const filter = req.query.filter
  if (filter === 'area') {
    res.json([])
  } else if (filter === 'district') {
    res.json([])
  } else if (filter === 'sector') {
    postcodeModel
      .getPostcodeLsoasFromSectors(req.body)
      .then(lsoas => res.json(lsoas))
  } else {
    res.json([])
  }
})

module.exports = router
