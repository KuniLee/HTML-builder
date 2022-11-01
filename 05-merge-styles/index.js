const {createReadStream, createWriteStream} = require('fs')
const {resolve, extname} = require('path')
const {readdir} = require('fs/promises')

const pathToStyles = resolve(__dirname, 'styles')
const pathToBundle = resolve(__dirname, 'project-dist', 'bundle.css')

readdir(pathToStyles, {withFileTypes: true}).then(data => data.filter(el =>
  el.isFile() && extname(resolve(pathToStyles, el.name)) === '.css'))
  .then(res => Promise.all(res.map(file => new Promise(resol => {
    let data = ''
    const readStream = createReadStream(resolve(pathToStyles, file.name))
    readStream.on('data', chunk => {
      data += chunk
    })
    readStream.on('end', () => {
      resol(data)
    })
  }))))
  .then(data => {
    const bundle = createWriteStream(pathToBundle)
    bundle.on('error', err => {
      console.error(err)
    })
    data.forEach((el) => {
      bundle.write(el)
    })
  })
  .then(() => {
    console.log('bundle created')
  })