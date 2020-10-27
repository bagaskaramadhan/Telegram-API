const jwt = require('jsonwebtoken')
const { JWTSECRET, errToken, forbidden } = require('../helpers/env')

const auth = {

  authentification: (req, res, next) => {
    const token = req.headers.token
    if (token === undefined || token === '') {
      errToken(res, [], "Token not found!");
      // res.json('notoken')
    } else {
      next()
    }
  },

  authorization: (req, res, next) => {
    const token = req.headers.token
    jwt.verify(token, JWTSECRET, (err, decoded) => {
      if (err && err.name === 'JsonWebTokenError') {
        errToken(res, [], "Authentification failed !");
        // res.json('gagal')
      } else if (err && err.name === 'TokenExpiredError') {
        errToken(res, [], "Token Expired !");
        // res.json('expired')
      }
      else {
        // console.log(decoded);
        next()
      }
    })
  },

  admin: (req, res, next) => {
    const token = req.headers.token
    jwt.verify(token, JWTSECRET, (err, decode) => {
      if (err && err.name === 'JsonWebTokenError') {
        errToken(res, [], "Authentification failed !");
      } else if (err && err.name === 'TokenExpiredError') {
        errToken(res, [], "Token Expired !");
      }
      else {
        if (decode.level === 1) {
          next()
        } else {
          forbidden(res, 'Dont have permission!')
        }
      }
    })
  }


}

module.exports = auth