const fs = require('fs')
const path = require('path')
const readline = require('readline')
const {stdin: input, stdout: output} = require('process')

const pathToFile = path.resolve(__dirname, 'newTextFile.txt')

const writeStream = fs.createWriteStream(pathToFile)
const rl = readline.createInterface({input, output})

rl.write('Enter text for the file:\n')
rl.on('line', (input) => {
  if (input.toString() === 'exit') rl.emit('SIGINT')
  else writeStream.write(input)
})
rl.on('SIGINT', () => {
  rl.write('Goodbye!')
  rl.close()
})