'use strict'
const express = require('express')
const app = express()

const libraryAuthorities = require('./routes/libraryAuthorities')
const lsoas = require('./routes/lsoas')
const postcodes = require('./routes/postcodes')
const routing = require('./routes/routing')

require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Allow cross origin
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use('/rest/libraryauthorities', libraryAuthorities)
app.use('/rest/lsoas', lsoas)
app.use('/rest/postcodes', postcodes)
app.use('/rest/routing', routing)

// Set port to be 8080 for development, or the process environment for production/dev.
const port = process.env.PORT || 8080
const server = app.listen(port)
server.timeout = 240000
