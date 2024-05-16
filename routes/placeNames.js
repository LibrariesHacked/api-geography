const express = require('express')
const router = express.Router()
const cache = require('../middleware/cache')

const placeNameModel = require('../models/placeName')

/**
 * Gets a single place name by lng/lat
 * @query {*} lng A longitude to retrieve data for
 * @query {*} lat A latitude to retrieve data for
 * @returns {*} placeNameData An object containing the place name data
 */
router.get('/', cache(86400), async (req, res) => {
  const longitude = req.query.lng
  const latitude = req.query.lat
  if (!longitude || !latitude) {
    return res.status(400).json({ error: 'Invalid request' })
  }

  const placeNameData = await placeNameModel.getPlaceNameFromLngLat(
    longitude,
    latitude
  )
  if (!placeNameData) {
    return res.status(404).json({ error: 'No place names found' })
  }
  return res.json(placeNameData)
})

/**
 * Search for place names by a given search term
 * @param {*} term The search term to search for
 * @returns {*} placeNames An array of place names that match the search term
 */
router.get('/search/:term', cache(86400), async (req, res) => {
  const term = req.params.term
  if (!term) return res.status(400).json({ error: 'Invalid request' })
  const placeNames = await placeNameModel.searchPlaceNames(term)
  if (!placeNames) {
    return res.status(404).json({ error: 'No place names found' })
  }
  return res.json(placeNames)
})

/**
 * Gets a single place name by name
 */
router.get('/:name', cache(86400), async (req, res) => {
  const name = req.params.name
  if (!name) return res.status(400).json({ error: 'Invalid request' })
  const placeNameData = await placeNameModel.getPlaceName(name)
  if (!placeNameData) {
    return res.status(404).json({ error: 'Place name not found' })
  }

  return res.json(placeNameData)
})

module.exports = router
