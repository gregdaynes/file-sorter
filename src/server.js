const log = require('lib/log')
const app = require('express')()
const { PORT } = require('lib/env')

const dao = require('lib/dao')()
const tagRepo = require('lib/tag-repo')(dao)
const fileRepo = require('lib/file-repo')(dao)

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

app.get('/files', async (req, res) => {
  const files = await fileRepo.getAll()

  const data = files.map((file) => fileRepo.serialize(file))

  res.json({ data: { files: data } })
})

app.get('/files/tagged/:tag', async (req, res) => {
  const files = await fileRepo.getByTag(req.params.tag)

  res.json({ data: { files } })
})

app.get('/files/:fileId', async (req, res) => {
  const file = await fileRepo.getById(req.params.fileId)
  const data = fileRepo.serialize(file)

  res.json({ data: { file: data } })
})

app.listen(PORT, log.info.bind(null, `Running on port ${PORT}`))
