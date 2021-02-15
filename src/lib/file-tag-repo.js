module.exports = fileTagRepository

function fileTagRepository (dao) {
  return {
    createTable () {
      return dao.run(`
        CREATE TABLE IF NOT EXISTS file_tags (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          file INTEGER,
          tag INTEGER
        )`,
      )
    },

    create ({ file, tag }) {
      return dao.run(
        'INSERT INTO file_tags (file, tag) VALUES (?, ?)',
        [file, tag],
      )
    },

    update (id, { file, tag }) {
      return dao.run(
        'UPDATE file_tags SET file = ?, tag = ? WHERE id = ?',
        [file, tag, id],
      )
    },

    delete (id) {
      return dao.run(
        'DELETE FROM file_tags WHERE id = ?',
        [Date(), id],
      )
    },
  }
}
