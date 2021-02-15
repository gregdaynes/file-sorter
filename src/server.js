const log = require('lib/log')
const app = require('express')()
const { PORT } = require('lib/env')

app.listen(PORT, log.info.bind(null, `Running on port ${PORT}`))
