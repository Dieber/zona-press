const program = require('commander')
const inquirer = require('inquirer')
const moment =require('moment')
const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const {TokenParser, MarkDownNodeParser, HTMLParser} = require('md-to-html-lite')
const { markdownPlugin } = require('./utils/msPlugins') 
const { getMdMetadata } = require('./utils/getMdMetadata')
const Handlebars = require('handlebars') 
// 生成dist文件夹

// 生成生成文件

// 包括所有文章->html
const Metalsmith = require('metalsmith')

async function generateArticleListPage() {
  let source = await fs.readFile(path.resolve(__dirname, './template/article_list.html'), 'utf-8')
  let template = Handlebars.compile(source)
  let metaDatas = await getMdMetadata(path.resolve(__dirname, '../articles'))
  let handleBarData = {
    articleList: metaDatas
  }
  var result = template(handleBarData);
  fs.writeFile(path.resolve(__dirname, '../dist/article_list.html'), result, 'utf-8')
}

function generateArticles() {
  return new Promise((resolve, reject) => {
    const metalsmith = Metalsmith(path.resolve(__dirname, '../articles'))
    metalsmith
    .clean(false)
    .source('.')
    .use(markdownPlugin())
    .destination(path.resolve(path.resolve(__dirname, '../dist/articles')))
    .build((err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

function moveHtmls() {
  return new Promise((resolve, reject) => {
    let metalsmith = Metalsmith(path.resolve(__dirname, '../pages'))
    metalsmith
    .clean(false)
    .source('.')
    .destination(path.resolve(path.resolve(__dirname, '../dist/')))
    .build((err) => {
      if (err) {
        throw err
      }
    })
    metalsmith = Metalsmith(path.resolve(__dirname, '../images'))
    metalsmith
    .clean(false)
    .source('.')
    .destination(path.resolve(path.resolve(__dirname, '../dist/images/')))
    .build((err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

async function generate () {
  try{
    await generateArticles()
    await moveHtmls()
    await generateArticleListPage()
  } catch(e){
    throw Error('转换失败')
  }
}

generate()

module.exports = {
  generate
}