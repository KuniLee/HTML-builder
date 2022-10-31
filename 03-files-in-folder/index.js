const {readdir, stat} = require('fs/promises')
const {resolve, extname, basename} = require('path')


const pathToDir = resolve(__dirname, 'secret-folder')


readdir(pathToDir, {withFileTypes: true}).then(res => {

  // return array of files only paths
  return res.filter(el => el.isFile()).map(el => resolve(pathToDir, el.name))
}).then(paths => {
  Promise.all(paths.map(filePath => stat(filePath))) // get array of promises of stats
    .then((stats) => {
      paths.forEach((file, idx) => {
        const fileName = basename(file, extname(file))
        const ext = extname(file).slice(1)
        const size = stats[idx].size / 1000 + 'kb'

        // generate file info string
        console.log([fileName, ext, size].filter(el => el).join(' - '))
      })
    })
})
