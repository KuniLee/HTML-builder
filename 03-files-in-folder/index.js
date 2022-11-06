const {readdir, stat} = require('fs/promises')
const {resolve, extname, basename} = require('path')

const pathToDir = resolve(__dirname, 'secret-folder')

async function dirInfo() {
  const info = await readdir(pathToDir, {withFileTypes: true})
  const filePaths = info.filter(el => el.isFile()).map(el => resolve(pathToDir, el.name))
  const stats = await Promise.all(filePaths.map(filePath => stat(filePath)))
  let result = ''
  filePaths.forEach((file, idx) => {
    const fileName = basename(file, extname(file))
    const ext = extname(file).slice(1)
    const size = stats[idx].size / 1000 + 'kb'
    result += ([fileName, ext, size].filter(el => el).join(' - ')) + '\r\n'
  })
  return result.trim()
}

dirInfo().then(console.log)