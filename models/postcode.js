const pool = require('../helpers/database')

const viewName = 'vw_postcodes'

const viewFields = [
  'postcode',
  'postcode_sector',
  'postcode_district',
  'postcode_area',
  'lsoa',
  'lsoa_name',
  'ward',
  'ward_name',
  'district',
  'district_name',
  'county',
  'county_name',
  'library_service',
  'library_service_name',
  'region',
  'region_name',
  'country',
  'country_name',
  'longitude',
  'latitude',
  'northing',
  'easting',
  'st_asgeojson(st_transform(geom, 4326)) as geojson'
]

/**
 * Returns data for a given postcode
 * @param {*} postcode A postcode to retrieve data for
 * @returns {*} postcodeData An object containing the postcode data
 */
module.exports.getPostcode = async postcode => {
  let postcodeData = {}
  const qryPostcode = postcode.replace(/\s/g, '').toUpperCase()
  const query = `select ${viewFields.join(
    ', '
  )} from ${viewName} where postcode_trimmed = $1 and terminated is false`
  try {
    const { rows } = await pool.query(query, [qryPostcode])
    if (rows && rows.length > 0) postcodeData = rows[0]
  } catch (e) {}
  return postcodeData
}

/**
 * Returns data for a given lng/lat
 * @param {*} lng A longitude to retrieve data for
 * @param {*} lat A latitude to retrieve data for
 * @returns {*} postcodeData An object containing the postcode data
 */
module.exports.getPostcodeFromLngLat = async (lng, lat) => {
  let postcodeData = {}
  const query = `select ${viewFields.join(
    ', '
  )} from ${viewName} where terminated = false order by geom <-> st_transform($1, 27700) limit 1`
  try {
    const { rows } = await pool.query(query, [`SRID=4326;POINT(${lng} ${lat})`])
    if (rows && rows.length > 0) postcodeData = rows[0]
  } catch (e) {}
  return postcodeData
}

/**
 * Search for postcodes by a given search term
 * @param {*} term A search term to retrieve data for
 * @returns {*} postcodes An array containing the postcode data
 */
module.exports.searchPostcodes = async term => {
  const postcodes = []
  const qryTerm = term.replace(/\s/g, '').toUpperCase()
  const query = `select ${viewFields.join(
    ', '
  )} from ${viewName} where postcode_trimmed like $1 and terminated = false order by postcode_trimmed limit 50`
  try {
    const { rows } = await pool.query(query, [`${qryTerm}%`])
    if (rows && rows.length > 0) rows.forEach(row => postcodes.push(row))
  } catch (e) {}
  return postcodes
}

/**
 * Returns matching LSOAs for a given set of postcode sectors
 * @param {Array} sectors A list of postcode sectors to retrieve LSOAs for
 * @returns {*} lsoas An object containing the LSOA data
 */
module.exports.getPostcodeLsoasFromSectors = async sectors => {
  const lsoas = {}
  const qrySectors = JSON.stringify(sectors).replace(/\s/g, '').toUpperCase()
  const query = 'select * from fn_postcodelsoasfromsectors($1)'
  try {
    const { rows } = await pool.query(query, [qrySectors])
    if (rows && rows.length > 0) {
      rows.forEach(row => {
        lsoas[row.lsoa] = row.postcode
      })
    }
  } catch (e) {}
  return lsoas
}
