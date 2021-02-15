const log = require('lib/log')
const dateFns = require('date-fns')

const Dao = require('lib/dao')
const FileRepo = require('lib/file-repo')
const TagRepo = require('lib/tag-repo')
const FileTagRepo = require('lib/file-tag-repo')

module.exports = analyze

async function analyze () {
  const dao = Dao()
  const fileRepo = FileRepo(dao)
  const tagRepo = TagRepo(dao)
  const fileTagRepo = FileTagRepo(dao)

  const files = fileRepo.getUnprocessed()

  const promises = []
  for (const file of await files) {
    const [dates, name] = findDate(file.name)
    const parsedName = parseName(name)

    const tagsPromise = createTags(dates, parsedName, tagRepo)
      .then((tags) => associateTags(file, tags, fileTagRepo))

    const processedPromise = fileRepo.setProcessed(file.id)

    promises.push(tagsPromise, processedPromise)
  }

  return Promise.all(promises)
}

function findDate (name) {
  const date = name.match(/(\d{2}\.+){2}(\d{2})/g)

  if (!date) return [undefined, name]

  const updatedName = name.split(date[0]).join('')
  const parsedDate = parseDate(date[0])

  return [dateFns.format(parsedDate, 'yyyy-MM-dd'), updatedName]
}

function parseDate (date) {
  const formats = ['MM.yy.dd', 'yy.MM.dd', 'dd.yy.MM']

  const validFormats = formats
    .map((format) => dateFns.parse(date, format, new Date()))
    .filter((x) => dateFns.isValid(x))

  return validFormats[0]
}

function parseName (name) {
  return name
    .replaceAll(/[.\s]/g, '|')
    .split('|')
    .filter(Boolean)
}

function createTags (dates = [], names = [], tagRepo) {
  const tags = [...dates, ...names]
    .map((tag) => tagRepo.create({ tag }))

  return Promise.all(tags)
}

function associateTags (file, tags, fileTagRepo) {
  const associations = tags
    .map((tag) => fileTagRepo.create({ file: file.id, tag: tag.id }))

  return Promise.all(associations)
}
