const express = require('express')
const http = require('http')

const port = process.env.PORT || 3030


const app = express()
const { common } = require('./routes')

app
    .use(common)

    .use((req, res, next) => {
        const err = new Error('Not Found')
        err.status = 404
        next(err)
    })

    .use((err, req, res, next) => {

        res.status(err.status || 500)
        res.send({
            message: err.message,
            error: app.get('env') === 'development' ? err : {}
        })
    })


const server = http.Server(app)

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})