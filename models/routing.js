const axios = require('axios')

/**
 * Retrieves an isochrone from the OpenRouteService API
 * @param {string} transport The transport type to use
 * @param {string} longitude The longitude of the location
 * @param {string} latitide The latitude of the location
 * @param {string} location The location type
 * @param {integer} duration The total duration of the isochrone
 * @param {integer} interval The interval between isochrone rings
 * @returns {*} An object containing the isochrone data
 */
module.exports.getIsochrone = async (
  transport,
  longitude,
  latitide,
  location = 'destination',
  duration = 1800,
  interval = 300
) => {
  const url = 'https://api.openrouteservice.org/v2/isochrones/' + transport
  const body = {
    locations: [[longitude, latitide]],
    location_type: location,
    intersections: true,
    attributes: ['area', 'total_pop', 'reachfactor'],
    range: [duration],
    interval: interval
  }
  const config = {
    headers: {
      Authorization: process.env.ROUTESERVICEKEY // eslint-disable-line
    }
  }
  try {
    const response = await axios.post(url, body, config)
    return response.data
  } catch (e) {}
  return null
}
