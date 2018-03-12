const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const userThreeId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'andrew@example.com',
    password: 'userOnePass',
    tokens: [{
      access: 'auth',
      token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
  }, {
    _id: userTwoId,
    email: 'jen@example.com',
    password: 'userTwoPass'
  },
  {
      _id: userThreeId,
  email: 'tom@example.com',
  password: 'userThreePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userThreeId, access: 'auth'}, 'abc123').toString()
  }]
}];

  const populateUsers = (done) => {
    User.remove({}).then(() => {
      var userOne = new User(users[0]).save();
      var userTwo = new User(users[1]).save();
      var userThree = new User(users[2]).save();
  
      return Promise.all([userOne, userTwo,userThree])
    }).then(() => done());
  };
  
  module.exports = { users, populateUsers};