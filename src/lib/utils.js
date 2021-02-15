module.exports = {
  random,
}

function random () {
  return Number(process.hrtime().join('')).toString(36)
}
