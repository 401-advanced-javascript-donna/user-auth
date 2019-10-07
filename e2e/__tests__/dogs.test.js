const request = require('../request');
const { dropCollection } = require('../db');
const { signupUser } = require('../data-helpers');
const User = require('../../lib/models/user');

describe('Dogs API', () => {
  beforeEach(() => dropCollection('users'));
  beforeEach(() => dropCollection('dogs'));

  const testUser = {
    email: 'me@me.com',
    password: 'abc'
  };

  const doggo = {
    name: 'Ren Hoek'
  };

  function postDog(doggo) {
    return request
      .post('/api/dogs')
      .set('Authorization', user.token)
      .send(doggo);
  }

  let user = null;

  beforeEach(() => {
    return request
      .post('/api/auth/signup')
      .send(testUser)
      .expect(200)
      .then(({ body }) => {
        return User.updateById(body._id, {
          $addToSet: {
            roles: 'admin'
          }
        })
          .then(updateUser => {
            return request
              .post('/api/auth/signin')
              .send(testUser)
              .expect(200);
          })
          .then(({ body }) => {
            user = body;
          });
      });
  });

  it('admin can post dogs', () => {
    return postDog(doggo).then(({ body }) => {
      expect(body).toMatchInlineSnapshot(
        {
          _id: expect.any(String)
        },
        `
        Object {
          "__v": 0,
          "_id": Any<String>,
          "name": "Ren Hoek",
        }
      `
      );
    });
  });

  it.skip('admin can update a doggo', () => {
    console.log(doggo.name)
    return postDog(doggo).then(({ body }) => {
      return request
        .put(`/api/dogs/${body._id}`)
        .set('Authorization', user.token)
        .send({ name: 'Ren Höek' })
        .expect(200)
        .then(({ body }) => {
          expect(body.name).toBe('Ren Höek');
        });
    });
  });
});
