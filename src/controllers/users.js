const usersModel = require('../models/users');
const {deleteMsg} = require('../models/users')
const {
  success,
  failed
} = require('../helpers/response');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const fs = require('fs')
const {
  JWTSECRET,JWTREGISTER
} = require('../helpers/env');
const sendMail = require('../helpers/mail')
const upload = require('../helpers/uploads')
const path = require('path');
const { error } = require('console');
const { send } = require('process');

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
      jwt.sign({ data: data.email }, JWTREGISTER, (err, response) => {
        if (err) {
          failed(res, [], err.message)
          console.log(err.message)
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
                    sendMail(sendData.email, sendData.token)
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
  verify: (req, res) => {
    const token = req.params.token
    jwt.verify(token, JWTREGISTER, (err, decode) => {
      if(err) {
        failed(res, [], 'Failed Auth!')
      } else {
        // const data = jwt.decode(token)
        const email = decode.data
        usersModel.activation(email).then(() => {
          res.render('index', {email})
          // console.log('ok')
          // res.json({msg: 'oke'})
        }).catch(err => {
          failed(res, [], err.message)
        })
      }
    })
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
          } else if (results.is_active === 0) {
            failed(res, [], 'Please Active Email First')
          }
          else {
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
    try {
        // const body = req.body
        upload.single('image')(req, res, (err) => {
            if (err) {
              // console.log(err)
                if (err.code === `LIMIT_FILE_SIZE`) {
                    failed(res, [], 'Large image')
                } else {
                    failed(res, [], err)
                }
            } else {
                const id = req.params.id
                const body = req.body
                usersModel.getOne(id)
                    .then((response) => {
                      // console.log(req.file.filename)
                        const imageOld = response[0].image
                        body.image = !req.file ? imageOld : req.file.filename
                        
                        if (body.image !== imageOld) {
                            if (imageOld !== 'default.png') {
                                fs.unlink(`src/uploads/${imageOld}`, (err) => {
                                    if (err) {
                                        failed(res, [], err.message)
                                    } else {
                                        usersModel.updateUsers(body, id)
                                            .then((result) => {
                                                success(res, result, 'Update success')
                                            })
                                            .catch((err) => {
                                                failed(res, [], err.message)
                                            })
                                    }
                                })
                            } else {
                                usersModel.updateUsers(body, id)
                                    .then((result) => {
                                        success(res, result, 'Update success')
                                    })
                                    .catch((err) => {
                                        failed(res, [], err.message)
                                    })
                            }
                        } else {
                            usersModel.updateUsers(body, id)
                                .then((result) => {
                                    success(res, result, 'Update success')
                                })
                                .catch((err) => {
                                    failed(res, [], err.message)
                                })
                        }
                    })
            }
        })
    } catch (err) {
        failed(res, [], 'Server Internal Error')
    }
},
getAll: (req, res) => {
  try {
      const name = !req.query.name ? "" : req.query.name;
      const sort = !req.query.sort ? "id" : req.query.sort;
      const typesort = !req.query.typesort ? "ASC" : req.query.typesort;
      const limit = !req.query.limit ? 10 : parseInt(req.query.limit);
      const page = !req.query.page ? 1 : parseInt(req.query.page);
      const offset = page <= 1 ? 0 : (page - 1) * limit;
      usersModel.getAll(name, sort, typesort, limit, offset)
          .then((result) => {
              const totalRows = result[0].count;
              const meta = {
                  total: totalRows,
                  totalPage: Math.ceil(totalRows / limit),
                  page: page,
              }
              successWithMeta(res, result, meta, "Get all data success");
          })
          .catch((err) => {
              failed(res, [], err.message);
          })
  } catch (error) {
      failed(res, [], "Server internal error")
  }
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
},
deleteMessage: async (req,res) => {
  try {
    const id = req.params.id
    const deleteMessage = await deleteMsg(id)
    success(res,deleteMessage, 'Delete Message Success')
  } catch (err) {
    error(res,[],err.message)
  }
}
}

module.exports = users