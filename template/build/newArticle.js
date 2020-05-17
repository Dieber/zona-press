const program = require('commander')
const inquirer = require('inquirer')
const moment =require('moment')
const fs = require('fs-extra')
const Handlebars = require('handlebars')
const path = require('path')
const chalk = require('chalk')

let now = moment()

inquirer.prompt([
{
  type: 'input',
  message: '您要生成的文章标题为？',
  name: 'newTitle',
  validate: (data) => {
    return data ? true : '请输入要生成的标题'
  }
}, {
  type: 'input',
  message: '写一些描述',
  name: 'newDesc',
}, {
  type: 'input',
  message: '写一些标签, 用逗号隔开.',
  name: 'newTags',
}])

.then(async (answers) => {
  let source = await fs.readFile(path.resolve(__dirname, './template/new.md'), 'utf-8')
  let data = {
    newTitle: answers.newTitle,
    newDate: now.format('YYYY-MM-DD')
  }
  
  if (answers.newDesc) {
    data.newDesc = `desc: ${answers.newDesc}\n`
  }
  if (answers.newTags) {
    data.newTags = `tags: ${answers.newTags}\n`
  }

  var template = Handlebars.compile(source);
  let result = template(data)

  fs.writeFile(path.resolve(__dirname, `../articles/${now.format('YYYYMMDD')}-${answers.newTitle}.md`), result, 'utf-8').then(() => {
    console.log(chalk.greenBright(`已生成${answers.newTitle}文件`))
  }).catch((e) => {
    console.error(e)
  })
})