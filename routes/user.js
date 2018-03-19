const router = require('express').Router()
const _ = require('lodash')
var {User} = require('./../models/user');
const {authenticate} = require('../middleware/authenticate');

router.post('/users', (req, res) => {

    var body = _.pick(req.body, ['email', 'password','name']);
    var user = new User(body);

    user.save().then(() => {
      return user.generateAuthToken();
    }).then((token) => {

      res.header('x-auth', token).send({user,token});
    }).catch((e) => {
      res.status(400).send({'error : ': 'there was some kind of error with the signing in  process , your email might already be in use'});
    })
  });


router.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send({token,user});
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

router.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

router.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

  module.exports = router
