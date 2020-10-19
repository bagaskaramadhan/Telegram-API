require('dotenv').config()

module.exports = {
    PORT: process.env.PORT,
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASS,
    DATABASE: process.env.DB_NAME,
    SECRETKEY: process.env.SECRET,
    USEREMAIL: process.env.USEREMAIL,
    USERPASS: process.env.USERPASS,
    HOSTURL: process.env.HOSTURL
}