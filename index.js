const express = require('express')
const http = require('http')
const dotenv = require('dotenv')
const bodyParser = require('body-parser');
dotenv.config();

const port = process.env.PORT || 3030
var {mongoose} = require('./db/mongoose');

const app = express()

const { common , user } = require('./routes')

app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(common,user)
    
    
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