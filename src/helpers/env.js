require("dotenv").config();

const env = {
  PORT: process.env.PORT,
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASS: process.env.DB_PASS,
  DTBS: process.env.DB_NAME,
  SECRET: process.env.PRIVATEKEY
};

module.exports = env;