const router = require('express').Router()
const _ = require('lodash')
var {User} = require('./../models/user');
const {authenticate} = require('../middleware/authenticate');

router.post('/users', (req, res) => {
    console.log('body : ',req.body)
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
  
    user.save().then(() => {
      return user.generateAuthToken();
    }).then((token) => {
      res.header('x-auth', token).send(user);
    }).catch((e) => {
      res.status(400).send({'error : ': 'there was some kind of error with the signing in  process , your email might already be in use'});
    })
  });
  
router.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
  });
  
  module.exports = router