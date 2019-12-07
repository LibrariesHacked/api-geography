"use strict";
const express = require("express");
const bodyParser = require('body-parser');
const graphql = require("graphql");
const express_graphql = require("express-graphql");
const { buildSchema } = graphql;
const app = express();
const postcodes = require('./routes/postcodes');

// Allow cross origin
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// Allow us to read JSON as JSON and text as text
app.use(bodyParser.json());
app.use(bodyParser.text({ type: 'text/csv' }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/rest/postcodes', postcodes);

const schema = buildSchema(`
    type Query {
        message: String
    }
`);

const root = {
	message: () => 'Graph QL Server for UK geography data'
};

app.use(
	'/graphql',
	express_graphql({
		schema: schema,
		rootValue: root,
		graphiql: true
	})
);

app.listen(3000, () =>
	console.log('GraphQL server running on localhost:3000')
);