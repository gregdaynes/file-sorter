const _ = require('lodash')
const dao = require('lib/dao')
const fileRepo = require('lib/file-repo')(dao())
const tagRepo = require('lib/tag-repo')(dao())
const fileTagRepo = require('lib/file-tag-repo')(dao())
const utils = require('lib/utils')

const files = Promise.all([
  fileRepo.create({ name: 'test1', path: '/test/path1' }),
  fileRepo.create({ name: 'test2', path: '/test/path2' }),
  fileRepo.create({ name: 'test3', path: '/test/path3' }),
  fileRepo.create({ name: 'test4', path: '/test/path4' }),
  fileRepo.create({ name: 'test5', path: '/test/path5' }),
])

const tags = Promise.all([
  tagRepo.create({ tag: utils.random() }),
  tagRepo.create({ tag: utils.random() }),
  tagRepo.create({ tag: utils.random() }),
  tagRepo.create({ tag: utils.random() }),
  tagRepo.create({ tag: utils.random() }),
  tagRepo.create({ tag: utils.random() }),
  tagRepo.create({ tag: utils.random() }),
  tagRepo.create({ tag: utils.random() }),
  tagRepo.create({ tag: utils.random() }),
  tagRepo.create({ tag: utils.random() }),
])

Promise.all([files, tags])
  .then(([files, tags]) => associateFileTags(files, tags))

function associateFileTags (files, tags) {
  const groupedTags = _.chunk(tags, tags.length / files.length)
  const fileTags = _.zip(files, groupedTags)

  const associations = fileTags
    .flatMap(([fileId, tagIds]) => {
      return tagIds.map((tagId) => {
        return {
          file: fileId,
          tag: tagId,
        }
      })
    })

  associations.forEach((association) => {
    fileTagRepo.create(association)
  })
}
