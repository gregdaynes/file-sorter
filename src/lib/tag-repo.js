module.exports = tagRepository

function tagRepository (dao) {
  return {
    createTable () {
      return dao.run(
        `CREATE TABLE IF NOT EXISTS tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tag TEXT UNIQUE,
            type TEXT,
            created_date DATETIME,
            deleted_date DATETIME
          )`,
      )
    },

    // createOrReturn
    async create ({ tag }) {
      await dao.run(
        'INSERT OR IGNORE INTO tags (tag, created_date, deleted_date) VALUES (?, ?, ?)',
        [tag, Date(), null],
      )

      return dao.get(
        'SELECT id FROM tags WHERE tag = ?',
        [tag],
      )
    },

    update (id, { tag, type }) {
      return dao.run(
        'UPDATE tags SET tag = ?, type = ? WHERE id = ?',
        [tag, type, id],
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

    getByTag (tag) {
      return dao.get(
        'SELECT id, tag, type FROM tags WHERE tag = ?',
        [tag],
      )
    },

    getAll () {
      return dao.all('SELECT id, tag, type FROM tags')
    },
  }
}
