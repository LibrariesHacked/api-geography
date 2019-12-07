const pool = require('../helpers/database');

module.exports.getPostcode = async (postcode) => {
	let postcode_data = {};
	const query = 'select * from vw_postcodes where postcode_trimmed = replace($1, \' \', \'\')';
	try {
		const { rows } = await pool.query(query, [postcode]);
		if (rows && rows.length > 0) postcode_data = rows[0];
	} catch (e) { }
	return postcode_data;
}

module.exports.getPostcodeLsoasFromSectors = async (sectors) => {
	let lsoas = {};
	const query = 'select * from fn_postcodelsoasfromsectors($1::jsonb)';
	try {
		const { rows } = await pool.query(query, [JSON.stringify(sectors)]);
		if (rows && rows.length > 0) {
			rows.forEach(row => {
				lsoas[row.lsoa] = row.postcode;
			});
		}
	} catch (e) { }
	return lsoas;
}
