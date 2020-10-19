const db = require('mysql2')
const {DATABASE,HOST,USER,PASSWORD} = require('../helper/env')

const connection = db.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE
})
connection.connect( (err) => {
    if (err){ 
        throw err
    }
    else {
        console.log(`Connected on Database ${DATABASE}`);
    }
     })
  
  module.exports = connection