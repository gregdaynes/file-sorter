module.exports = tagRepository

function tagRepository (dao) {
  return {
    createTable () {
      return dao.run(
        `CREATE TABLE IF NOT EXISTS tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tag TEXT,
            created_date DATETIME,
            deleted_date DATETIME
          )`,
      )
    },

    create ({ tag }) {
      return dao.run(
        'INSERT INTO tags (tag, created_date, deleted_date) VALUES (?, ?, ?)',
        [tag, Date(), null],
      )
    },

    update (id, { tag }) {
      return dao.run(
        'UPDATE tags SET tag = ? WHERE id = ?',
        [tag, id],
      )
    },

    delete (id) {
      return dao.run(
        'UPDATE tags SET deleted_date = ? WHERE id = ?',
        [Date(), id],
      )
    },

    getById (id) {
      return dao.get(
        'SELECT id, tag, type FROM tags WHERE id = ?',
        [id],
      )
    },

    getAll () {
      return dao.all('SELECT id, tag, type FROM tags')
    },
  }
}
