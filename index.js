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

const { common , user ,chatroom ,sessions} = require('./routes')

app
    //.use(cors())
    .use(function (req, res, next) {
         // Website you wish to allow to connect
         res.setHeader('Access-Control-Allow-Origin', '*');

         // Request methods you wish to allow
         res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

         // Request headers you wish to allow
         res.setHeader("Access-Control-Allow-Headers", "Origin,X-Requested-With,content-type,x-auth");

         // Set to true if you need the website to include cookies in the requests sent
         // to the API (e.g. in case you use sessions)
         res.setHeader('Access-Control-Allow-Credentials', true);

         // Pass to next layer of middleware
         next();
     })
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(common,user,chatroom,sessions)


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
