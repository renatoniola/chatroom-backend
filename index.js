let env = process.env.NODE_ENV || 'development';

if( env === 'development'){

    process.env.PORT = 3030;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/chatApp';
} else if ( env === 'test'){
    process.env.PORT = 3031;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/chatAppTest';
}

const express = require('express')
const http = require('http')
const dotenv = require('dotenv')
const cors = require('cors')
const bodyParser = require('body-parser');
dotenv.config();

const port = process.env.PORT || 3030
const {mongoose} = require('./db/mongoose');

const app = express()

const { common , user ,chatroom } = require('./routes')

app
    .use(cors())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(common,user,chatroom)


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

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT} in enviroment ${env} with mongodb : ${process.env.MONGODB_URI}`)
})

module.exports = {app};
