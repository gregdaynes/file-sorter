const _ = require('lodash')
module.exports = fileRepository

function fileRepository (dao) {
  return {
    createTable () {
      return dao.run(
        `CREATE TABLE IF NOT EXISTS files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            path TEXT,
            created_date DATETIME,
            deleted_date DATETIME,
            processed_date DATETIME
          )`,
      )
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

    async getById (id) {
      const files = await dao.all(`
        SELECT
          files.id id,
          files.name name,
          files.path path,
          json_object('id', tags.id, 'tag', tags.tag) tag
        FROM files
        JOIN file_tags ON files.id = file_tags.file
        JOIN tags ON file_tags.tag = tags.id
        WHERE files.id = ?
        `,
      [id],
      )

      return aggregateFile(files)
    },

    async getByTag (tag) {
      const files = await dao.all(`
        SELECT
          files.id id,
          files.name name,
          files.path path,
          json_object('id', tags.id, 'tag', tags.tag) tag
        FROM files
        JOIN file_tags ON files.id = file_tags.file
        JOIN tags ON file_tags.tag = tags.id
        WHERE tags.tag = ?
        `,
      [tag],
      )

      return Object.values(aggregateFiles(files))
    },

    async getAll () {
      const files = await dao.all(`
         SELECT
           files.id id,
           files.name name,
           files.path path,
          json_object('id', tags.id, 'tag', tags.tag) tag
         FROM files
         JOIN file_tags ON files.id = file_tags.file
         JOIN tags ON file_tags.tag = tags.id
        `,
      )

      return Object.values(aggregateFiles(files))
    },

    getUnprocessed () {
      return dao.all(`
        SELECT *
        FROM files
        WHERE processed_date IS NULL
      `)
    },

    setProcessed (id) {
      return dao.run(
        'UPDATE files SET processed_date = ? WHERE id = ?',
        [Date(), id],
      )
    },
  }
}

function aggregateFile (file) {
  return file
    .reduce((acc, file) => ({
      id: file.id,
      name: file.name,
      path: file.path,
      tags: (acc.tags || []).concat(JSON.parse(file.tag)),
    }))
}

function aggregateFiles (files) {
  return files
    .reduce((acc, file) => {
      const obj = acc[file.id] || {
        id: file.id,
        name: file.name,
        path: file.path,
        tags: [],
      }

      obj.tags.push(JSON.parse(file.tag))

      acc[file.id] = obj
      return acc
    }, {})
}
