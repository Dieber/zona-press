const fs = require('fs-extra')
const { md2Html } = require('./md2html')
const path = require('path')
const Handlebars = require('handlebars')


const idendity = x => x

const markdownPlugin = () => (files, metalsmith, done) => {
  let filenames = Object.keys(files)
  // 过滤掉不必要的files
  filenames = filenames.filter((filename) => {
    return /.*\.md$/.test(filename)
  })
  let promises = []
  filenames.forEach((filename) => {
    let promise = fs.readFile(metalsmith.directory() + '/' + filename, 'utf-8')
    promises.push(promise)
  })

  Promise.all(promises).then((reses) => {
    return reses.map((res) => {
      let metaData = {}
      try {
        res
        .match(/---([\s\S]*?)---/m)[1]
        .split('\n')
        .filter(idendity)
        .forEach((metaString) => {
          metaData[metaString.split(':')[0].trim()] = metaString.split(':')[1].trim()
        })
      } catch(e) {
        throw Error('文件格式不正确')
      }
      let markdown = res.match(/---[\s\S]*?---([\s\S]*)/m)[1]
      metaData.content = md2Html(markdown)
      return metaData
    })
  }).then(async (metaDatas) => {
    for (const key in metaDatas) {
      let metaData = metaDatas[key]
      let source = await fs.readFile(path.resolve(__dirname, '../template/article.html'), 'utf-8')
      let template = Handlebars.compile(source)
      var result = template(metaData);
      let filename = `${metaData.time.split('-').join('')}-${metaData.title}`
      let data = files[filename + '.md']
      data.contents = Buffer.from(result)
      delete files[filename + '.md']
      files[filename + '.html'] = data
    }
    done()
  }).catch((e) => {
    console.log(e)
  })
}
module.exports = {markdownPlugin}