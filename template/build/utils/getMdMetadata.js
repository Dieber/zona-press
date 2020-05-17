const fs = require('fs-extra')
const path = require('path')

const idendity = x => x

// options: 传
let getMdMetadata = async (dir) => {
  let filenames = fs.readdirSync(dir)
  let promises = []
  
  filenames.forEach((filename) => {    
    let promise = fs.readFile(dir + '/' + filename, 'utf-8')
    promises.push(promise)
  })

  let metadatas = await Promise.all(promises).then((files) => {
    return files.map((file) => {
      let metaData = {}
      try {
        file
        .match(/---([\s\S]*?)---/m)[1]
        .split('\n')
        .filter(idendity)
        .forEach((metaString) => {
          metaData[metaString.split(':')[0].trim()] = metaString.split(':')[1].trim()
        })
      } catch(e) {
        throw Error('文件格式不正确')
      }
      metaData.filename = metaData.time.split('-').join('') 
        + '-' 
        + metaData.title
      return metaData
    })
  })
  return metadatas
}

module.exports = {
  getMdMetadata
}