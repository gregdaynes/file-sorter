const log = require('lib/log')
const app = require('express')()
const { PORT } = require('lib/env')

const dao = require('lib/dao')()
const tagRepo = require('lib/tag-repo')(dao)

app.get('/tags', async (req, res) => {
  const tags = await tagRepo.getAll()

  res.json({ data: { tags } })
})
app.listen(PORT, log.info.bind(null, `Running on port ${PORT}`))
