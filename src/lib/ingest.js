const log = require('lib/log')
const fs = require('fs').promises
const path = require('path')
const mkdirp = require('mkdirp')
const dao = require('lib/dao')
const fileRepo = require('lib/file-repo')

const { INGEST_PATH, STORE_PATH } = require('lib/env')

const ingestPath = getCreateDir(path.resolve(INGEST_PATH))
const storePath = getCreateDir(path.resolve(STORE_PATH))

module.exports = ingest

async function ingest () {
  const repo = fileRepo(dao())

  const files = dirList(ingestPath)

  for (const fileName of await files) {
    // setup destination for file
    const letterIndex = fileName.match(/\w/g)[0]
    const destStore = getCreateDir(path.resolve(storePath, letterIndex))

    const srcPath = path.resolve(ingestPath, fileName)
    const destFile = createDestPath(destStore, fileName)
    const destPath = path.format(destFile)

    // create entry in db { id, path, name, created, deleted, processed }
    const recordId = await repo.create({ name: destFile.orig })

    // move the file
    fs.rename(srcPath, destPath)
      .then(() => log.info('File moved', { srcPath, destPath, recordId }))
      .catch((err) => {
        log.error('Error moving ingest file', { err, srcPath, destPath, recordId })
      })

    // update the database
    repo.update(recordId, { name: destFile.orig, path: destPath })
  }
}

async function dirList (path) {
  return fs.readdir(path)
}

function getCreateDir (path) {
  return mkdirp.sync(path) || path
}

function pathExists (path) {
  return fs.access(path).then(() => true).catch(() => false)
}

function createDestPath (destStore, filename) {
  const destFile = path.resolve(destStore, filename)
  const parsedDestPath = path.parse(destFile)

  if (!pathExists(destFile)) return { ...parsedDestPath, orig: parsedDestPath.name }

  // generate random suffix
  const random = Number(process.hrtime().join('')).toString(36)
  const { root, dir, ext, name } = parsedDestPath

  return {
    root,
    dir,
    ext,
    orig: name,
    name: `${name}-${random}`,
  }
}

ingest()
