const {copyFile, mkdir, readdir, unlink} = require('fs/promises')
const {resolve} = require('path')

const sourceDir = resolve(__dirname, 'files')
const distDir = sourceDir + '-copy'

let fileList = []

mkdir(distDir, {recursive: true})
  .then(() => readdir(sourceDir, {withFileTypes: true}))
  .then(data => data.filter(el => el.isFile()))
  .then(files => {
    fileList = files
    return files.map(el => copyFile(resolve(sourceDir, el.name),
      resolve(distDir, el.name)))
  })
  .then(promises => {
    return Promise.all(promises)
  })
  .then(() => readdir(distDir, {withFileTypes: true}))
  .then(newFiles=>{
    newFiles.forEach(newFile=>{
      if (!fileList.find(el=>el.name === newFile.name))
        unlink(resolve(distDir, newFile.name))
    })
  })
