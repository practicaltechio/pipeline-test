const koa = require('koa')
const koaRouter = require('koa-router')

const port = process.argv[2] || 9000

const app = new koa()
const router = new koaRouter()

router.get('', '/', (ctx) => {
  ctx.body = {
    message: 'Welcome to Practical Tech!',
    version: '1.3'
  }
})

router.get('', '/sum', (ctx) => {
  ctx.body = {
    result: parseInt(ctx.request.query.term1) + parseInt(ctx.request.query.term2)
  }
})


app.use(router.routes())
  .use(router.allowedMethods())

app.listen(port, () => console.log(`running on port ${port}`))