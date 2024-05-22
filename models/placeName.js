const pool = require('../helpers/database')

const viewName = 'vw_place_names'

const viewFields = [
  'name1',
  'name1_lang',
  'name2',
  'name2_lang',
  'local_type',
  'easting',
  'northing',
  'longitude',
  'latitude',
  'postcode_district',
  'populated_place',
  'district',
  'county',
  'region',
  'country',
  'geojson',
  'bbox_geojson'
]

/**
 * Returns data for a given place name
 * @param {*} name A place name to retrieve data for
 * @param {*} types An array of types to filter by
 * @returns {*} placeName An object containing the name data
 */
module.exports.getPlaceName = async (name, types) => {
  let placeName = {}
  const query = `select ${viewFields.join(
    ', '
  )} from ${viewName} where name1 = $1 and local_type = ANY($2) limit 1`
  try {
    const { rows } = await pool.query(query, [name, types])
    if (rows && rows.length > 0) placeName = rows[0]
  } catch (e) {}
  return placeName
}

/**
 * Returns place name data for a given lng/lat
 * @param {*} lng A longitude to retrieve data for
 * @param {*} lat A latitude to retrieve data for
 * @param {*} types An array of types to filter by
 * @returns {*} placeName An object containing the place name data
 */
module.exports.getPlaceNameFromLngLat = async (lng, lat, types) => {
  let placeName = {}
  const args = [`SRID=4326;POINT(${lng} ${lat})`]
  let typeQuery = ''
  if (types) {
    args.push(types)
    typeQuery = 'where local_type = ANY($2)'
  }
  const query = `select ${viewFields.join(
    ', '
  )} from ${viewName} ${typeQuery} order by geom <-> st_transform($1, 27700) limit 1`
  try {
    const { rows } = await pool.query(query, args)
    if (rows && rows.length > 0) placeName = rows[0]
  } catch (e) {}
  return placeName
}

/**
 * Search for place names by a given search term
 * @param {*} term A search term to retrieve data for
 * @param {*} types An array of types to filter by
 * @returns {*} placeNames An array containing the place name data
 */
module.exports.searchPlaceNames = async (term, types) => {
  const placeNames = []
  const args = [`%${term}%`]
  let typeQuery = ''
  if (types) {
    args.push(types)
    typeQuery = 'and local_type = ANY($2)'
  }
  const query = `select ${viewFields.join(
    ', '
  )} from ${viewName} where name1 ilike $1 ${typeQuery} order by name1 limit 50`
  try {
    const { rows } = await pool.query(query, args)
    if (rows && rows.length > 0) rows.forEach(row => placeNames.push(row))
  } catch (e) {}
  return placeNames
}
