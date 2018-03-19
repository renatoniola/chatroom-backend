const router = require('express').Router()
const jwt = require('jsonwebtoken')
const {authenticate} = require('../middleware/authenticate');
var {User} = require('./../models/user');


router.post('/sessions', (req, res) => {
  console.log(req.body.email)
  User.find({ email : req.body.email}, (err, user) =>{
    console.log(err,user)
  })
  //const payload = { id: user._id }
  //const token = jwt.sign(payload, '123abc')
  res.send('ciao')
})

module.exports = router
