const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../index');
const {User} = require('./../models/user');
const { users, populateUsers} = require('./seed/seedMultiUser');
const {Chatroom} = require('./../models/chatroom');





console.log('chatroom.js');

describe('Chatroom tests', () => {

  beforeEach(populateUsers);
  console.log(users)

  it('should create a chatroom with two users', (done) => {
    
    Chatroom.remove({},function(){});

    request(app)
      .post('/chatroom')
      .set('x-auth', users[0].tokens[0].token)
      .send({"targetuser" : users[1]._id ,"message" : "test message" })
      .expect(200)
      .expect((res) => {
        expect(res.body.messages[0].text).toBe( "test message" );
        expect(res.body.messages[0]._creator).toBe( users[0]._id.toString() );
      })
    .end(done);
  })

  it('should not create another chatroom', (done) => {
      request(app)
      .post('/chatroom')
      .set('x-auth', users[0].tokens[0].token)
      .send({"targetuser" : users[1]._id ,"message" : "new test message" })
      .expect(200)
      
      .expect((res) => {

        Chatroom.count({}, function( err, count){
          expect( count).toBe( 1 );
        })
        
        
      })
    .end(done);
  });

   it('should  create another chatroom with the third user', (done) => {
    request(app)
    .post('/chatroom')
    .set('x-auth', users[2].tokens[0].token)
    .send({"targetuser" : users[0]._id ,"message" : "test message for new chatroom" })
    .expect(200)
    
    .expect((res) => {

      Chatroom.count({}, function( err, count){
        expect( count).toBe( 2 );
      })
      
      
    })
  .end(done);
}); 

it('should return 2 chatrooms belonging to the first user', (done) => {
    request(app)
    .get('/chatrooms')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    
    .expect((res) => {
      expect(res.body.chatrooms.length).toBe(2)
    })
  .end(done);
  }); 
});