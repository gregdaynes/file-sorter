module.exports = fileRepository

function fileRepository (dao) {
  return {
    createTable () {
      const sql = `
        CREATE TABLE IF NOT EXISTS files (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          path TEXT,
          created_date DATETIME,
          deleted_date DATETIME,
          processed_date DATETIME
        )
      `

      return dao.run(sql)
    },

    create ({ name, path }) {
      return dao.run(
        'INSERT INTO files (name, path, created_date, deleted_date, processed_date) VALUES (?, ?, ?, ?, ? )',
        [name, path, Date(), null, null],
      )
    },

    update (id, { name, path }) {
      return dao.run(
        'UPDATE files SET name = ?, path = ? WHERE id = ?',
        [name, path, id],
      )
    },

    delete (id) {
      return dao.run(
        'UPDATE files SET deleted_date = ? WHERE id = ?',
        [Date(), id],
      )
    },

    getById (id) {
      return dao.get(
        'SELECT * FROM files WHERE id = ?',
        [id],
      )
    },

    getAll () {
      return dao.all('SELECT * FROM files')
    },
  }
}
