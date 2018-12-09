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
         app[method.toLowerCase()](path, (req, res) => {
           fn(req)
             .fork(
               x => res.json(x),
               x => res.json(x)
             )
         })
       }
    })
  })

  return { on }
}

module.exports = { createReceiver }
