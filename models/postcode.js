const pool = require('../helpers/database')

module.exports.getPostcode = async (postcode) => {
  let postcodeData = {}
  const query = 'select * from vw_postcodes where postcode_trimmed = $1'
  try {
    const { rows } = await pool.query(query, [postcode.replace(/\s/g, '').toUpperCase()])
    if (rows && rows.length > 0) postcodeData = rows[0]
  } catch (e) { }
  return postcodeData
}

module.exports.getPostcodeLsoasFromSectors = async (sectors) => {
  const lsoas = {}
  const query = 'select * from fn_postcodelsoasfromsectors($1)'
  try {
    const { rows } = await pool.query(query, [JSON.stringify(sectors).replace(/\s/g, '').toUpperCase()])
    if (rows && rows.length > 0) {
      rows.forEach(row => {
        lsoas[row.lsoa] = row.postcode
      })
    }
  } catch (e) { }
  return lsoas
}
