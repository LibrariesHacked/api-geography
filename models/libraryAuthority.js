const pool = require('../helpers/database')
const viewFields = ['utla19cd', 'utla19nm', 'utla19nmw']

module.exports.getLibraryAuthorities = async () => {
  let authorities = []
  const query = 'select ' + viewFields.join(', ') + ', st_asgeojson(st_snaptogrid(st_simplify(st_transform(geom, 4326), 0.001, false), 0.001)) as geom, st_asgeojson(st_transform(st_snaptogrid(bbox, 0.001), 4326)) as bbox from vw_library_boundaries'
  try {
    const { rows } = await pool.query(query)
    if (rows && rows.length > 0) authorities = rows
  } catch (e) {
    console.log(e)
  }
  return authorities
}

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
