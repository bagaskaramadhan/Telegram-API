const express = require('express')
const {register, verify, login, updateUsers, getUsers, deleteUsers, refreshToken, getAll, resetPass, confirmPass} = require('../controller/users')
const router = express.Router()
const upload = require('../helper/upload')

router
.post('/register', register)
.get('/verification/:token', verify)
.post('/login', login)
.get('/getall', getAll)
.get('/getone/:id', getUsers)
.patch('/edit/:id', upload.single("image"), updateUsers)

module.exports = router