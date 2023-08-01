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
  const longitude = req.query.lng
  const latitude = req.query.lat
  if (!longitude || !latitude) return res.json({})
  const postcodeData = await postcodeModel.getPostcodeFromLngLat(
    longitude,
    latitude
  )
  if (!postcodeData) return res.json({})
  return res.json(postcodeData)
})

/**
 * Gets a single postcode by postcode
 */
router.get('/:postcode', cache(86400), async (req, res) => {
  const postcode = req.params.postcode
  if (!postcode) return res.json({})
  const postcodeData = await postcodeModel.getPostcode(postcode)
  if (!postcodeData) return res.json({})
  return res.json(postcodeData)
})

/**
 * Gets LSOAs from postcodes
 */
router.post('/lsoas', async (req, res) => {
  const filter = req.query.filter
  // Could be a very long request
  res.setTimeout(600000)

  // The filter must be either area/sector/district
  if (filter === 'area') {
    res.json([])
  } else if (filter === 'district') {
    res.json([])
  } else if (filter === 'sector') {
    const sectors = req.body
    const lsoas = await postcodeModel.getPostcodeLsoasFromSectors(sectors)
    return res.json(lsoas)
  } else {
    res.json([])
  }
})

module.exports = router
