const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../index');
const {User} = require('./../models/user');
const { users, populateUsers} = require('./seed/seed');


console.log('user.test.js');

describe('User tests', () => {
  beforeEach(populateUsers);
  describe('GET /users/me', () => {
      it('should return user if authenticated', (done) => {
        request(app)
          .get('/users/me')
          .set('x-auth', users[0].tokens[0].token)
          .expect(200)
          .expect((res) => {
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
          })
          .end(done);
      });
    
      it('should return 401 if not authenticated', (done) => {
        request(app)
          .get('/users/me')
          .expect(401)
          .expect((res) => {
            expect(res.body).toEqual({});
          })
          .end(done);
      });
    });
    
    describe('POST /users', () => {
      it('should create a user', (done) => {
        var email = 'example@example.com';
        var password = '123mnb!';
    
        request(app)
          .post('/users')
          .send({email, password})
          .expect(200)
          .expect((res) => {
            expect(res.headers['x-auth']).toBeTruthy();
            expect(res.body._id).toBeTruthy();
            expect(res.body.email).toBe(email);
          })
          .end((err) => {
            if (err) {
              return done(err);
            }
    
            User.findOne({email}).then((user) => {
              expect(user).toBeTruthy();
              expect(user.password).not.toBe(password);
              done();
            });
          });
      });
    
      it('should return validation errors if request invalid', (done) => {
        request(app)
          .post('/users')
          .send({
            email: 'and',
            password: '123'
          })
          .expect(400)
          .end(done);
      });
    
      it('should not create user if email in use', (done) => {
        request(app)
          .post('/users')
          .send({
            email: users[0].email,
            password: 'Password123!'
          })
          .expect(400)
          .end(done);
      });
    });
});

describe('DELETE /users/me/token', () => {

  beforeEach(populateUsers);
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});