const request = require('../request');
const { dropCollection } = require('../db');
// eslint-disable-next-line no-unused-vars
const jwt = require('jsonwebtoken');
const { signupUser } = require('../data-helpers');

describe('Auth API', () => {

  beforeEach(() => dropCollection('users'));

  const testUser = {
    email: 'me@me.com',
    password: 'abc'
  };

  let user = null;

  beforeEach(() => {
    return signupUser(testUser)
      .then(newUser => user = newUser);
  });

  it('signs up a user', () => {
    expect(user.token).toBeDefined();
  });

  it('cannot sign up with same email', () => {
    return request
      .post('/api/auth/signup')
      .send(testUser)
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe('Email me@me.com already in use');
      });
  });

  function testEmailAndPasswordRequired(route, testProperty, user) {
    it(`${route} requires ${testProperty}`, () => {
      return request
        .post(`/api/auth/${route}`)
        .send(user)
        .expect(400)
        .then(({ body }) => {
          expect(body.error).toBe('Email and password required');
        });
    });
  }

  testEmailAndPasswordRequired('signup', 'email', { password: 'I no like emails' });
  testEmailAndPasswordRequired('signup', 'password', { email: 'no@password.com ' });
  testEmailAndPasswordRequired('signin', 'email', { password: 'I no like emails' });
  testEmailAndPasswordRequired('signup', 'password', { email: 'no@password.com' });

  it('signs in a user', () => {
    return request
      .post('/api/auth/signin')
      .send(testUser)
      .expect(200)
      .then(({ body }) => {
        expect(body.token).toBeDefined();
      });
  });

});