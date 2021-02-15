const dao = require('lib/dao')
const fileRepo = require('lib/file-repo')(dao())
const tagRepo = require('lib/tag-repo')(dao())
const fileTagRepo = require('lib/file-tag-repo')(dao())

// create tables
fileRepo.createTable()
tagRepo.createTable()
fileTagRepo.createTable()
