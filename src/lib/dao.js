const log = require('lib/log')
const sqlite3 = require('sqlite3').verbose()

const { DATABASE_PATH } = require('lib/env')

function DAO () {
  const db = new sqlite3.Database(DATABASE_PATH, (err) => {
    if (err) throw new Error('Could not connect to database', err)

    log.debug('connected to database')
  })

  return {
    db,

    run (sql, params = []) {
      return new Promise((resolve, reject) => {
        // callback is bound to run which has { lastID, changes }
        db.run(sql, params, function (err) {
          if (err) {
            log.error('Error running sql:', sql)
            return reject(err)
          }

          return resolve(this.lastID)
        })
      })
    },

    get (sql, params = []) {
      return new Promise((resolve, reject) => {
        db.get(sql, params, (err, result) => {
          if (err) {
            log.error('Error running sql:', sql)
            return reject(err)
          }

          return resolve(result)
        })
      })
    },

    all (sql, params = []) {
      return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
          if (err) {
            log.error('Error running sql:', sql)
            return reject(err)
          }
          return resolve(rows)
        })
      })
    },
  }
}

module.exports = DAO
