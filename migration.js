const dao = require('lib/dao')
const fileRepo = require('lib/file-repo')(dao())

// create tables
fileRepo.createTable()
