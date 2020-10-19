const express = require('express')
const app = express()
const socketio = require('socket.io')
const port = 3000
const bodyParser = require('body-parser')
const db = require('./src/config/db')
const users = require('./src/router/users')
const path = require('path')
const ejs = require('ejs')
const cors = require('cors')
const http = require('http')
const server = http.createServer(app)
const io = socketio(server)



app.get('/users', (req, res) => {
    users(res)
})

app.use('/users',routes)

server.listen(PORT, () =>{
    console.log(`SERVER RUNNNING ON PORT ${PORT}`)
})