const pool = require('../helpers/database');
const view_fields = ['lsoa11cd', 'lsoa11nm', 'st_asgeojson(st_transform(geom, 4326))'];

module.exports.getLsoa = async (lsoa) => {
	let lsoa_data = {};
	const query = 'select ' + view_fields.join(', ') + ' from vw_lsoa_boundaries where lsoa11cd = $1';
	try {
		const { rows } = await pool.query(query, [lsoa]);
		if (rows && rows.length > 0) lsoa_data = rows[0];
	} catch (e) { }
	return lsoa_data;
}

module.exports.getLsoaTile = async (x, y, z) => {
	const query = 'select fn_lsoas_mvt($1, $2, $3)';
	let tile = null;
	try {
		const { rows } = await pool.query(query, [x, y, z]);
		if (rows && rows.length > 0 && rows[0].fn_lsoas_mvt) tile = rows[0].fn_lsoas_mvt;
	} catch (e) { }
	return tile;
}