const express = require("express")
const usersController = require("../controllers/users")


const router = express.Router()

router.post("/register", usersController.register)
router.post("/login", usersController.login)
router.patch('/update/:email', usersController.updateUser)
module.exports = router