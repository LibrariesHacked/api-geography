const pool = require('../helpers/database')
const viewFields = ['utla19cd', 'utla19nm', 'utla19nmw']
const generalisedGeoJson = 'st_asgeojson(st_simplify(st_snaptogrid(st_transform(geom, 4326), 0.0001), 0.01, false)) as geojson'
const detailGeoJson = 'st_asgeojson(st_simplify(st_snaptogrid(st_transform(geom, 4326), 0.00001), 0.0001, false)) as geojson'

module.exports.getLibraryAuthorities = async (fields, location) => {
  let authorities = []
  if (fields.length === 0) fields = [...viewFields, 'st_asgeojson(st_transform(st_snaptogrid(bbox, 0.1), 4326)) as bbox']
  fields.push(generalisedGeoJson)

  let orderBy = 'utla19cd'

  if (location && location.length > 0 && !isNaN(location[0]) && !isNaN(location[1])) {
    fields.push(`round(st_distance(st_transform(st_setsrid(st_makepoint(${location[0]}, ${location[1]}), 4326), 27700), geom)) as min_distance`)
    fields.push(`round(st_maxdistance(st_transform(st_setsrid(st_makepoint(${location[0]}, ${location[1]}), 4326), 27700), geom)) as max_distance`)
    orderBy = 'min_distance'
  }

  const query = `select ${fields.join(', ')} from vw_library_boundaries order by ${orderBy}`
  try {
    const { rows } = await pool.query(query)
    if (rows && rows.length > 0) authorities = rows
  } catch (e) { }
  return authorities
}

module.exports.getLibraryAuthorityById = async (fields, code) => {
  let libraryAuthorityData = {}
  if (fields.length === 0) fields = [...viewFields]
  fields.push(detailGeoJson)

  const query = 'select ' + fields.join(', ') + ' from vw_library_boundaries where utla19cd = $1'
  try {
    const { rows } = await pool.query(query, [code])
    if (rows && rows.length > 0) libraryAuthorityData = rows[0]
  } catch (e) { }
  return libraryAuthorityData
}

module.exports.getLibraryAuthorityByName = async (fields, name) => {
  let libraryAuthorityData = {}
  if (fields.length === 0) fields = [...viewFields]
  fields.push(detailGeoJson)

  const query = 'select ' + fields.join(', ') + ' from vw_library_boundaries where utla19nm = $1'
  try {
    const { rows } = await pool.query(query, [name])
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
