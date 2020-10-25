const usersModel = require('../models/users');
const {
  success,
  failed
} = require('../helpers/response');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const fs = require('fs')
const {
  JWTSECRET
} = require('../helpers/env');

const upload = require('../helpers/uploads')
const path = require('path');
const { error } = require('console');

const users = {
  register: (req, res) => {
    const body = req.body
    if (!body.name || !body.email || !body.password) {
      failed(res, [], 'Name, email or password is required!')
    } else {
      const name = body.name
      const nameSplit = name.split(' ')
      const data = {
        name: body.name,
        email: body.email.toLowerCase(),
        username: nameSplit.join(' '),
        password: bcrypt.hashSync(body.password, 10)
      }
      jwt.sign({
        data: data.email
      }, JWTSECRET, {
        expiresIn: '60'
      }, (err, response) => {
        if (err) {
          failed(res, [], err.message)
        } else {
          usersModel.getEmail(data.email)
            .then((result) => {
              if (result.length === 0) {
                const sendData = {
                  name: data.name,
                  email: data.email,
                  username: data.username,
                  password: data.password,
                  token: response
                }
                usersModel.register(sendData)
                  .then((results) => {
                    success(res, results, 'Register success!')
                  })
                  .catch((err) => {
                    failed(res, [], err.message)
                  })
              } else {
                failed(res, [], 'Email is already registered!')
              }
            })
            .catch((err) => {
              failed(res, [], err.message)
            })
        }
      });
    }
  },

  login: (req, res) => {
    const body = req.body
    if (!body.email || !body.password) {
      failed(res, [], 'Email or password is required!')
    } else {
      const data = {
        email: req.body.email.toLowerCase(),
        password: req.body.password
      }
      usersModel.login(data)
        .then((result) => {
          const results = result[0]
          if (!results) {
            failed(res, [], 'Email not registered, please register')
          } else {
            const password = results.password
            const isMatch = bcrypt.compareSync(data.password, password)
            if (isMatch) {
              success(res, results, 'Login Success')
            } else {
              failed(res, [], 'Email or password is wrong!')
            }
          }
        }).catch((err) => {
          failed(res, [], err.message)
        });
    }
  },
  // getDetail: (req, res) => {
  //   try {
  //     const id = req.params.id
  //     usersModel.getDetail(id)
  //       .then((result) => {
  //         success(res, result, 'Get detail users success')
  //       })
  //   } catch {
  //     failed(res, [], 'internal server error')
  //   }
  // },
  updateUsers: (req, res) => {
      upload.single('image')
      (req, res, async (err) => {
        if (err) {
          if (err.code === `LIMIT_FIELD_VALUE`) {
            failed(res, [], `Image size is to big`)
          } else {
            failed(res, [], err)
          }
        } else {
          const id = req.params.id
          const body = req.body
          body.image = !req.file? '' : req.file.filename
          // console.log(body)
          try {
            const datauser = await usersModel.getDetail(id)
            // console.log(datauser)
            const newImage = body.image
            if (newImage) {
              if (datauser[0].image === 'default.png') {
                const results = await usersModel.updateUsers(body, id)
                .then((results) => {
                  success(res,results, 'Success update')
                })
                .catch((err) => {
                  failed(res, [], err)
                })
              } else {
                const oldPath = path.join(__dirname + `/../../src/uploads/${datauser[0].image}`)
                fs.unlink(oldPath, (err) => {
                  if (err) throw err
                  // console.log('delete')
                })
                const results = await usersModel.updateUsers(body,id)
                .then((results)=>{
                  success(res,results, 'Success update')
                })
                .catch((err)=>{
                  failed(res, [], err)
                })
              }
            } else {
              body.image = datauser[0].image
              const results = await usersModel.updateUsers(body,id)
              .then((results) => {
                success(res,results, 'Success update')
              })
              .catch((err)=>{
                failed(res, [], err)
              })
            }
          } catch (error) {
            
          }
        }
      })
  },
  getAll: (req, res) => {
    usersModel.getAll()
    .then((result) => {
      success(res, result, 'Success Get All Data')
    })
  },
  getUsers: (req, res) => {
    try {
        const id = req.params.id
        usersModel.getOne(id)
            .then((result) => {
                success(res, result, 'success get users')
            }).catch((err) => {
                failed(res, [], err.message)
            })
    } catch (err) {
        failed(res, [], "Server internal error")
    }
}
}

module.exports = users