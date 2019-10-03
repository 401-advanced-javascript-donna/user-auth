const { dropCollection } = require('../db');
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
  
});