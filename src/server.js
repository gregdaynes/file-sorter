const log = require('lib/log')
const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const { PORT, DIST_PATH } = require('lib/env')
const ingestService = require('lib/ingest-service')
const analyzeService = require('lib/analyze-service')

const app = express()
const dao = require('lib/dao')()
const tagRepo = require('lib/tag-repo')(dao)
const fileRepo = require('lib/file-repo')(dao)

const streamFile = require('lib/stream-file')

const distPath = path.resolve(DIST_PATH)

app.get('/tags', async (req, res) => {
  const tags = await tagRepo.getAll()

  res.json({ data: { tags } })
})

app.get('/tags/:tag', async (req, res) => {
  const tagParam = req.params.tag

  let tag
  if (Number(tagParam)) {
    tag = await tagRepo.getById(tagParam)
  } else {
    tag = await tagRepo.getByTag(tagParam)
  }

  res.json({ data: { tag } })
})

app.put('/tags/:tag', bodyParser.json(), async (req, res) => {
  const tagParam = req.params.tag

  let tag
  if (Number(tagParam)) {
    tag = await tagRepo.getById(tagParam)
  } else {
    tag = await tagRepo.getByTag(tagParam)
  }

  const newValues = {
    ...tag,
    ...(_.pick(req.body, ['tag', 'type'])),
  }

  await tagRepo.update(tag.id, newValues)

  tag = await tagRepo.getById(tag.id)

  res.json({ data: { tag } })
})

app.get('/files', async (req, res) => {
  const files = await fileRepo.getAll()

  const data = files.map((file) => fileRepo.serialize(file))

  res.json({ data: { files: data } })
})

app.get('/files/tagged/:tag', async (req, res) => {
  const files = await fileRepo.getByTag(req.params.tag)

  res.json({ data: { files } })
})

app.get('/files/:fileId/watch', streamFile)
app.get('/files/:fileId/stream', streamFile)

app.get('/files/:fileId', async (req, res) => {
  const file = await fileRepo.getById(req.params.fileId)
  const data = fileRepo.serialize(file)

  res.json({ data: { file: data } })
})

app.delete('/files/:fileId', async (req, res) => {
  await fileRepo.delete(req.params.fileId)

  res.json({ data: { success: true } })
})

app.get('/ingest', async (req, res) => {
  await ingestService()

  res.json({ data: { success: true } })
})

app.get('/analyze', async (req, res) => {
  await analyzeService()

  res.json({ data: { success: true } })
})

app.all('*', express.static(distPath), (req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'))
})

app.listen(PORT, log.info.bind(null, `Running on port ${PORT}`))
