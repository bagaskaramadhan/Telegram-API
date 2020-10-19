const mysql = require("mysql2");
const { DTBS, USER, HOST, PASS} = require("../helpers/env");

const connection = mysql.createConnection({
  host: HOST,
  user: USER,
  password: PASS,
  database: DTBS,
  dateStrings: "date",
});

connection.connect( function(err){
  if (err){ 
      throw err;
  }
  else {
      console.log(`Connected on Database ${DTBS}`);
  }
   });

module.exports = connection;