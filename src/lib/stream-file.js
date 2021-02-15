const fs = require('fs')
const path = require('path')
const dao = require('lib/dao')()
const fileRepo = require('lib/file-repo')(dao)

// Video streaming
// https://stackoverflow.com/questions/24976123/streaming-a-video-file-to-an-html5-video-player-with-node-js-so-that-the-video-c
module.exports = async function (req, res) {
  if (req.url.includes('/watch')) {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(`<video src="${req.url.replace('/watch', '/stream')}" controls></video>`)
  } else {
    const file = await fileRepo.getById(req.params.fileId)
    const filePath = path.resolve(file.path)

    fs.stat(filePath, (err, stats) => {
      if (err) {
        if (err.code === 'ENOENT') {
          // 404 Error if file not found
          return res.sendStatus(404)
        }

        res.end(err)
      }

      const range = req.headers.range

      // 416 Wrong range
      if (!range) return res.sendStatus(416)

      const positions = range.replace(/bytes=/, '').split('-')
      const start = parseInt(positions[0], 10)
      const total = stats.size
      const end = positions[1] ? parseInt(positions[1], 10) : total - 1
      const chunksize = (end - start) + 1

      res.writeHead(206, {
        'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      })

      const stream = fs.createReadStream(filePath, { start: start, end: end })
        .on('open', function () {
          stream.pipe(res)
        }).on('error', function (err) {
          res.end(err)
        })
    })
  }
}
