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
  'most_detail_view_resolution',
  'least_detail_view_resolution',
  'bbox_xmin',
  'bbox_ymin',
  'bbox_xmax',
  'bbox_ymax',
  'postcode_district',
  'populated_place',
  'district_name',
  'county',
  'region',
  'country',
  'st_asgeojson(st_transform(geom, 4326)) as geojson'
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
  const query = `select ${viewFields.join(
    ', '
  )} from ${viewName} where local_type = ANY($2) order by geom <-> st_transform($1, 27700) limit 1`
  try {
    const { rows } = await pool.query(query, [
      `SRID=4326;POINT(${lng} ${lat})`,
      types
    ])
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
  const query = `select ${viewFields.join(
    ', '
  )} from ${viewName} where name1 ilike $1 and local_type = ANY($2) order by name1 limit 50`
  try {
    const { rows } = await pool.query(query, [`${qryTerm}%`, types])
    if (rows && rows.length > 0) rows.forEach(row => placeNames.push(row))
  } catch (e) {}
  return placeNames
}