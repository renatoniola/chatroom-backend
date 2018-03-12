const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../index');
const {User} = require('./../models/user');
const { users, populateUsers} = require('./seed/seed');

//beforeEach(populateUsers);

describe('Chatroom tests', () => {
  it('should do something', () => {
    expect(0).toBeTruthy();
  })
  
});