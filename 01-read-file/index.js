const fs = require('fs')
const path = require('path')
const {stdout, exit} = process

const pathToFile = path.resolve(__dirname, 'text.txt')
const input = fs.createReadStream(pathToFile, 'utf-8')
input.on('data', chunk => {
  stdout.write(chunk)
})
input.on('end', () => {
  exit(0)
})