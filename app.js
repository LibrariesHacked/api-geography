'use strict'
const express = require('express')
const cors = require('cors')
const app = express()

const builtUpAreas = require('./routes/builtUpAreas')
const libraryAuthorities = require('./routes/libraryAuthorities')
const lsoas = require('./routes/lsoas')
const placeNames = require('./routes/placeNames')
const postcodes = require('./routes/postcodes')
const routing = require('./routes/routing')

require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

app.use('/rest/builtupareas', builtUpAreas)
app.use('/rest/libraryauthorities', libraryAuthorities)
app.use('/rest/lsoas', lsoas)
app.use('/rest/placenames', placeNames)
app.use('/rest/postcodes', postcodes)
app.use('/rest/routing', routing)

const port = process.env.PORT || 8080
const server = app.listen(port)
server.timeout = 240000
