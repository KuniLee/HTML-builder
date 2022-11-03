const {copyDir} = require('../04-copy-directory')
const {resolve} = require('path')
const {readFile, writeFile, mkdir} = require('fs/promises')
const {mergeStyles} = require('../05-merge-styles')

const distPath = resolve(__dirname, 'project-dist')
const componentsPath = resolve(__dirname, 'components')
const templateHtmlPath = resolve(__dirname, 'template.html')
const pathToStyles = resolve(__dirname, 'styles')
const pathToBundleStyles = resolve(distPath, 'style.css')
const pathToAssets = resolve(__dirname, 'assets')


function changeToComponent(path, matches, idx, template) {
  if (matches.length - 1 === idx) {
    return readFile(resolve(path, matches[idx][1] + '.html'), 'utf-8')
      .then(component => {
        return template.replace(matches[idx][0], component)
      })
  } else return readFile(resolve(path, matches[idx][1] + '.html'), 'utf-8')
    .then(component => {
      let newTepm = template.replace(matches[idx][0], component)
      return changeToComponent(path, matches, idx + 1, newTepm)
    })
}

readFile(templateHtmlPath, 'utf-8')
  .then(template => {
    const matches = Array.from(template.matchAll(/{{(.*?)}}/g))
    return changeToComponent(componentsPath, matches, 0, template)
  })
  .then(result => {
    return mkdir(distPath, {recursive: true})
      .then(() => writeFile(resolve(distPath, 'index.html'), result))
  })
  .then(() => mergeStyles(pathToStyles, pathToBundleStyles))
  .then(()=>{
    return copyDir(pathToAssets, resolve(distPath, 'assets'))
  })
  .then(()=>{
    console.log('done')
  })
