const axios = require('axios')

module.exports.getIsochrone = async (transport, longitude, latitide, location = 'destination', duration = 1800, interval = 300) => {
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
      'Authorization': process.env.ROUTESERVICEKEY// eslint-disable-line
    }
  }
  try {
    const response = await axios.post(url, body, config)
    return response.data
  } catch (e) {
    return null
  }
}
