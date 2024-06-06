const express = require('express')
const http = require('http')
const setupWebScoket = require('./webSocket')

const app = express()
const server = http.createServer(app)
const PORT = 8080

setupWebScoket(server)

server.listen(PORT, console.log(`ServerON [${PORT}]`))