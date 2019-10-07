const request = require('../request');
const { dropCollection } = require('../db');
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

  const postDoggo = doggo => {
    return request
      .post('/api/dogs')
      .set('Authorization', user.token)
      .send(doggo);
  };

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
          .then(() => {
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
    return postDoggo(doggo).then(({ body }) => {
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

  it.skip('admin can update dogs', () => {
    return postDoggo(doggo)
      .then(doggo => {
        doggo.name = 'Ren Hoooeeek';
        return request
          .put(`/api/dogs/${doggo._id}`)
          .set('Authorization', user.token)
          .send(doggo)
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.name).toBe('Ren Hoooeeek');
      });
  });

  it('admin can delete dogs', () => {
    return postDoggo(doggo).then(({ body }) => {
      return request
        .delete(`/api/dogs/${body._id}`)
        .set('Authorization', user.token)
        .expect(200);
    });
  });

  it('any user can get all dogs', () => {
    return Promise.all([
      postDoggo(doggo),
      postDoggo(doggo),
      postDoggo(doggo)
    ]).then(() => {
      return request
        .get('/api/dogs')
        .set('Authorization', user.token)
        .expect(200)
        .then(({ body }) => {
          expect(body.length).toBe(3);
          expect(body[0]).toMatchInlineSnapshot(
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
  });
});
