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

app.get('/files', async (req, res) => {
  const files = await fileRepo.getAll()

  res.json({ data: { files } })
})

app.get('/files/:fileId', async (req, res) => {
  const file = await fileRepo.getById(req.params.fileId)

  res.json({ data: { file } })
})

app.listen(PORT, log.info.bind(null, `Running on port ${PORT}`))
