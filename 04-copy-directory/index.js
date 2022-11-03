const {copyFile, mkdir, readdir, unlink} = require('fs/promises')
const {resolve} = require('path')

const sourceDir = resolve(__dirname, 'files')
const distDir = sourceDir + '-copy'

function copyDir(sourcePath, distPath) {

  let fileList = []
  return mkdir(distPath, {recursive: true})
    .then(() => readdir(sourcePath, {withFileTypes: true}))
    .then(data => {
      return Promise.all(data.map(el => {
        fileList.push(el)
        if (el.isFile()) {
          return copyFile(resolve(sourcePath, el.name),
            resolve(distPath, el.name))
        } else {
          return copyDir(resolve(sourcePath, el.name), resolve(distPath, el.name))
        }
      }))
    }).then(() => readdir(distPath, {withFileTypes: true}))
    .then(newFiles => newFiles
      .forEach(newFile => {
        if (!fileList.find(el => el.name === newFile.name))
          unlink(resolve(distPath, newFile.name))
      })
    )
}

copyDir(sourceDir, distDir)

exports.copyDir = copyDir