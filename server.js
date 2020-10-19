const express = require('express')
const server = express()
const { PORT } = require('./src/helper/env')
server.listen(PORT, () =>{
    console.log(`SERVER RUNNNING ON PORT ${PORT}`)
})