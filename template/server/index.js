let Koa = require('koa')
let app = new Koa()
let path = require('path')
let {generate} = require('../build/generate')
let fs = require('fs')
const serve = require('koa-static');

function runService () {
  app.use(serve(path.resolve(__dirname, '../dist/')))
  app.use((ctx) => {
    ctx.body = fs.readFileSync(path.resolve(__dirname, '../pages/404.html'), 'utf-8')
  })
  app.listen(4322)
  console.log('请打开 http://localhost:4322 进行预览')
}

async function start() {
  await generate()
  runService()
}

start()