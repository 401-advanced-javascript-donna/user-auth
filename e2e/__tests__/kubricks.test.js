const request = require('../request');
const db = require('../db');
const { signupUser } = require('../data-helpers');

describe('Kubrick API', () => {
  beforeEach(() => db.dropCollection('users'));
  beforeEach(() => db.dropCollection('kubricks'));

  let user = null;
  beforeEach(() => {
    return signupUser().then(newUser => (user = newUser));
  });

  const kubrick = {
    title: 'The Shining',
    yearRelease: 1980
  };

  it('post a kubrick film for this user', () => {
    return request
      .post('/api/kubricks')
      .set('Authorization', user.token)
      .send(kubrick)
      .expect(200)
      .then(({ body }) => {
        expect(body.owner).toBe(user._id);
        expect(body).toMatchInlineSnapshot(
          {
            _id: expect.any(String),
            owner: expect.any(String)
          },
          `
          Object {
            "__v": 0,
            "_id": Any<String>,
            "owner": Any<String>,
            "title": "The Shining",
            "writers": Array [],
            "yearRelease": 1980,
          }
        `
        );
      });
  });
});
