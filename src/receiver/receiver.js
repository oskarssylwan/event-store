const createReceiver = express => config => middleware => {
  const app = express()

  !!middleware.length && app.use(middleware)
  app.listen(config.port, () => {
    console.log(`Recevier listening on ${config.port}`)
  })

  const on = (method, path) =>
  ({
    pipe: fn =>
    ({
       send: _ =>
       {
         app[method.toLowerCase()](path, (req, res) => { res.json(fn(req)) })
       }
    })
  })

  return { on }
}

module.exports = { createReceiver }
