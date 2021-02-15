const _ = require('lodash')
const dao = require('lib/dao')()
const fileRepo = require('lib/file-repo')(dao)
const utils = require('lib/utils')
const ingest = require('lib/ingest-service')
const analyze = require('lib/analyze-service')

dropTables()
  .then(() => createFiles())
  .then(() => ingest())
  .then(() => analyze())

function dropTables () {
  return Promise.all([
    dao.run('DELETE FROM files'),
    dao.run('DELETE FROM tags'),
    dao.run('DELETE FROM file_tags'),
  ]).then(() => dao.run('VACUUM'))
}

function createFiles () {
  return Promise.all([
    [
      `date-test.22.01.10.${utils.random()}`,
      `date-test.21.12.25.${utils.random()}`,
      `date-test.22.01.03.${utils.random()}`,
      `date-test.22.01.07.${utils.random()}`,
      `date-test.22.01.13.${utils.random()}`,
      `date-test.21.02.07.${utils.random()}`,
      `date-test.22.02.06.${utils.random()}`,
      `date-test.22.01.26.${utils.random()}`,
      `date-test.22.02.01.${utils.random()}`,
      `date-test.21.12.29.${utils.random()}`,
      `date-test.22.02.11.${utils.random()}`,
      `date-test.22.02.05.${utils.random()}`,
      `date-test.22.01.01.${utils.random()}`,
      `date-test.22.02.06.${utils.random()}`,
      `date-test.21.12.08.${utils.random()}`,
      `date-test.22.01.22.${utils.random()}`,
      `date-test.22.01.28.${utils.random()}`,
      `date-test.22.02.06.${utils.random()}`,
      `date-test.22.02.12.${utils.random()}`,
      `date-test.22.01.02.${utils.random()}`,
      `date-test.22.01.01.${utils.random()}`,
      `date-test.22.02.05.${utils.random()}`,
      `date-test.21.12.22.${utils.random()}`,
      `date-test.22.01.24.${utils.random()}`,
      `date-test.22.02.05.${utils.random()}`,
      `date-test.20.11.26.${utils.random()}`,
    ].forEach((name) => {
      fileRepo.create({ name, path: '' })
    }),
  ])
}
