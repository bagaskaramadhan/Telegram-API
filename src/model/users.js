const db = require('../config/db')

const model = {
    register: (data, generate, image, phone) => {
        return new Promise((resolve, reject) => {
          // console.log(data, generate, image)
            db.query(`INSERT INTO users (email, password, name, image, phone) VALUES
            (
              '${data.email}',
              '${generate}',
              '${data.fullname}',
              '${image}',
              '${phone}')`,
               (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    },
    update: (email) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE users SET is_active= 1 WHERE email='${email}'`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    login: (data) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM users WHERE email = ?`, data.email, (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            })
        })
    },
    loginToken: (token, id) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE users SET token='${token}' WHERE id=${id}`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    getAll: (name, sort, typesort, limit, offset) => {
      return new Promise((resolve, reject) => {
          db.query(`SELECT *, (SELECT COUNT(*) FROM users) as count FROM users WHERE name LIKE '%${name}%' 
          ORDER BY ${sort} ${typesort} LIMIT ${offset},${limit}`, (err, result) => {
              if (err) {
                  reject(new Error(err))
              } else {
                  resolve(result)
              }
          })
      })
    },
    getOne: (id) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM users WHERE id=${id}`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    updateUsers: (data, id) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE users SET ? WHERE id = ${id}`, [data, id], (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    }
}

module.exports = model