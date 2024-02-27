const pool = require('../helpers/database')

const viewFields = [
  'code',
  'name',
  'min_imd_decile',
  'population',
  'classification'
]

const viewName = 'vw_built_up_area_boundaries'

/**
 * Retrieves a built up area by GSS code
 * @param {*} fields A list of fields to return
 * @param {*} builtUpAreaCode A GSS code for the BUA
 * @returns {*} buaData An object containing the BUA data
 */
module.exports.getBuiltUpArea = async (fields, builtUpAreaCode) => {
  let buaData = {}
  if (fields.length === 0) fields = [...viewFields]
  const query = `select ${fields.join(', ')} from ${viewName} where lower(code) = lower($1)`
  try {
    const { rows } = await pool.query(query, [builtUpAreaCode])
    if (rows && rows.length > 0) buaData = rows[0]
  } catch (e) {}
  return buaData
}

/**
 * Retrieves a vector tile of built up area data
 * @param {*} x The x tile value
 * @param {*} y The y tile value
 * @param {*} z The z tile zoom level
 * @returns {*} tile A tile containing the LSOA data
 */
module.exports.getBuiltUpAreasTile = async (x, y, z) => {
  const query = 'select fn_built_up_areas_mvt($1, $2, $3)'
  let tile = {}
  try {
    const { rows } = await pool.query(query, [x, y, z])
    if (rows && rows.length > 0 && rows[0].fn_built_up_areas_mvt)
      tile = rows[0].fn_built_up_areas_mvt
  } catch (e) {}
  return tile
}
