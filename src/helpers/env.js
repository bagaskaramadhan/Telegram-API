require("dotenv").config();

const env = {
  PORT: process.env.PORT,
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASS: process.env.DB_PASS,
  DTBS: process.env.DB_NAME,
  JWTSECRET: process.env.PRIVATEKEY,
  TOKENREFREST: process.env.PRIVATEKEYREFRESH,
  USEREMAIL: process.env.USEREMAIL,
  USERPASS: process.env.USERPASS,
  HOSTURL: process.env.HOSTURL
};

module.exports = env;