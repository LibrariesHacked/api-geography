const pool = require('../helpers/database')
const viewFields = [
  'lsoacd',
  'lsoanm',
  'st_asgeojson(st_transform(geom, 4326)) as geojson'
]

/**
 * Retrieves an LSOA by GSS code
 * @param {*} fields A list of fields to return
 * @param {*} lsoa A GSS code for the LSOA
 * @returns {*} lsoaData An object containing the LSOA data
 */
module.exports.getLsoa = async (fields, lsoa) => {
  let lsoaData = {}
  if (fields.length === 0) fields = [...viewFields]
  const query =
    'select ' + fields.join(', ') + ' from vw_lsoa_boundaries where lsoacd = $1'
  try {
    const { rows } = await pool.query(query, [lsoa])
    if (rows && rows.length > 0) lsoaData = rows[0]
  } catch (e) {}
  return lsoaData
}

/**
 * Retrieves a vector tile of LSOA data
 * @param {*} x The x tile value
 * @param {*} y The y tile value
 * @param {*} z The z tile zoom level
 * @returns {*} tile A tile containing the LSOA data
 */
module.exports.getLsoaTile = async (x, y, z) => {
  const query = 'select fn_lsoas_mvt($1, $2, $3)'
  let tile = {}
  try {
    const { rows } = await pool.query(query, [x, y, z])
    if (rows && rows.length > 0 && rows[0].fn_lsoas_mvt)
      tile = rows[0].fn_lsoas_mvt
  } catch (e) {}
  return tile
}
