const pool = require('../helpers/database')

/**
 * Returns data for a given postcode
 * @param {*} postcode A postcode to retrieve data for
 * @returns {*} postcodeData An object containing the postcode data
 */
module.exports.getPostcode = async postcode => {
  let postcodeData = {}
  const query = 'select * from vw_postcodes where postcode_trimmed = $1'
  try {
    const { rows } = await pool.query(query, [
      postcode.replace(/\s/g, '').toUpperCase() // remove spaces and make uppercase
    ])
    if (rows && rows.length > 0) postcodeData = rows[0]
  } catch (e) {}
  return postcodeData
}

/**
 * Returns matching LSOAs for a given set of postcode sectors
 * @param {Array} sectors A list of postcode sectors to retrieve LSOAs for
 * @returns {*} lsoas An object containing the LSOA data
 */
module.exports.getPostcodeLsoasFromSectors = async sectors => {
  const lsoas = {}
  const query = 'select * from fn_postcodelsoasfromsectors($1)'
  try {
    const { rows } = await pool.query(query, [
      JSON.stringify(sectors).replace(/\s/g, '').toUpperCase() // remove spaces and make uppercase
    ])
    if (rows && rows.length > 0) {
      rows.forEach(row => {
        lsoas[row.lsoa] = row.postcode
      })
    }
  } catch (e) {}
  return lsoas
}
