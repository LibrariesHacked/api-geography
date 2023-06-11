const pool = require('../helpers/database')

const viewFields = ['code', 'name', 'nice_name']
const generalisedGeoJson =
  'st_asgeojson(st_simplify(st_snaptogrid(st_transform(geom, 4326), 0.0001), 0.01, false)) as geojson'
const detailGeoJson =
  'st_asgeojson(st_simplify(st_snaptogrid(st_transform(geom, 4326), 0.00001), 0.0001, false)) as geojson'

/**
 * Retrieves a list of library authorities
 * @param {Array} fields A list of fields to return
 * @param {Array} location An optional location to sort by distance from
 * @returns {Array} authorities An array of library authorities
 */
module.exports.getLibraryAuthorities = async (fields, location) => {
  let authorities = []
  if (fields.length === 0)
    fields = [
      ...viewFields,
      'st_asgeojson(st_transform(st_snaptogrid(bbox, 0.1), 4326)) as bbox'
    ]
  fields.push(generalisedGeoJson)

  let orderBy = 'code'

  if (
    location &&
    location.length > 0 &&
    !isNaN(location[0]) &&
    !isNaN(location[1])
  ) {
    fields.push(
      `round(st_distance(st_transform(st_setsrid(st_makepoint(${location[0]}, ${location[1]}), 4326), 27700), geom)) as min_distance`
    )
    fields.push(
      `round(st_maxdistance(st_transform(st_setsrid(st_makepoint(${location[0]}, ${location[1]}), 4326), 27700), geom)) as max_distance`
    )
    orderBy = 'min_distance'
  }

  const query = `select ${fields.join(
    ', '
  )} from vw_library_boundaries order by ${orderBy}`
  try {
    const { rows } = await pool.query(query)
    if (rows && rows.length > 0) authorities = rows
  } catch (e) {}
  return authorities
}

/**
 * Retrieves a library authority by GSS code
 * @param {Array} fields A list of fields to return
 * @param {string} code A GSS code for the library authority
 * @returns {*} libraryAuthorityData An object containing the library authority data
 */
module.exports.getLibraryAuthorityByCode = async (fields, code) => {
  let libraryAuthorityData = {}
  if (fields.length === 0) fields = [...viewFields]
  fields.push(detailGeoJson)

  const query = `select ${fields.join(
    ', '
  )} from vw_library_boundaries where code = $1`
  try {
    const { rows } = await pool.query(query, [code])
    if (rows && rows.length > 0) libraryAuthorityData = rows[0]
  } catch (e) {}
  return libraryAuthorityData
}

/**
 * Retrieves a library authority by name
 * @param {*} fields A list of fields to return
 * @param {*} name The official name for the library authority
 * @returns {*} libraryAuthorityData An object containing the library authority data
 */
module.exports.getLibraryAuthorityByName = async (fields, name) => {
  let libraryAuthorityData = {}
  if (fields.length === 0) fields = [...viewFields]
  fields.push(detailGeoJson)

  const query = `select ${fields.join(
    ', '
  )} from vw_library_boundaries where name = $1`
  try {
    const { rows } = await pool.query(query, [name])
    if (rows && rows.length > 0) libraryAuthorityData = rows[0]
  } catch (e) {}
  return libraryAuthorityData
}

/**
 * Retrieves a library authority tile by x, y and z
 * @param {*} x The x tile value
 * @param {*} y The y tile value
 * @param {*} z The z tile zoom level
 * @returns {*} tile A tile containing the library authority data
 */
module.exports.getLibraryAuthorityTile = async (x, y, z) => {
  const query = 'select fn_library_authorities_mvt($1, $2, $3)'
  let tile = null
  try {
    const { rows } = await pool.query(query, [x, y, z])
    if (rows && rows.length > 0 && rows[0].fn_library_authorities_mvt)
      tile = rows[0].fn_library_authorities_mvt
  } catch (e) {}
  return tile
}
