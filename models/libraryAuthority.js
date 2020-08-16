const pool = require('../helpers/database')
const viewFields = ['utla19cd', 'utla19nm', 'utla19nmw', 'st_asgeojson(st_transform(geom, 4326))']

module.exports.getLibraryAuthority = async (code) => {
  let libraryAuthorityData = {}
  const query = 'select ' + viewFields.join(', ') + ' from vw_library_boundaries where utla19cd = $1'
  try {
    const { rows } = await pool.query(query, [code])
    if (rows && rows.length > 0) libraryAuthorityData = rows[0]
  } catch (e) { }
  return libraryAuthorityData
}

module.exports.getLibraryAuthorityTile = async (x, y, z) => {
  const query = 'select fn_library_authorities_mvt($1, $2, $3)'
  let tile = null
  try {
    const { rows } = await pool.query(query, [x, y, z])
    if (rows && rows.length > 0 && rows[0].fn_library_authorities_mvt) tile = rows[0].fn_library_authorities_mvt
  } catch (e) {
    console.log(e)
  }
  return tile
}