const pool = require('../helpers/database')
const viewFields = ['lsoa11cd', 'lsoa11nm', 'st_asgeojson(st_transform(geom, 4326)) as geojson']

module.exports.getLsoa = async (lsoa) => {
  let lsoaData = {}
  const query = 'select ' + viewFields.join(', ') + ' from vw_lsoa_boundaries where lsoa11cd = $1'
  try {
    const { rows } = await pool.query(query, [lsoa])
    if (rows && rows.length > 0) lsoaData = rows[0]
  } catch (e) { }
  return lsoaData
}

module.exports.getLsoaTile = async (x, y, z) => {
  const query = 'select fn_lsoas_mvt($1, $2, $3)'
  let tile = {}
  try {
    const { rows } = await pool.query(query, [x, y, z])
    if (rows && rows.length > 0 && rows[0].fn_lsoas_mvt) tile = rows[0].fn_lsoas_mvt
  } catch (e) { }
  return tile
}
