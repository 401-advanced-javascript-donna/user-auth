const request = require('../request');
const db = require('../db');
const { signupUser } = require('../data-helpers');

describe('me API', () => {
  beforeEach(() => db.dropCollection('users'));
  beforeEach(() => db.dropCollection('kubricks'));

  let user = null;
  beforeEach(() => {
    return signupUser().then(newUser => (user = newUser));
  });

  const kubrick = {
    title: 'A Clockwork Orange',
    yearRelease: 1971
  };

  function postKubrick() {
    return request
      .post('/api/kubricks')
      .set('Authorization', user.token)
      .send(kubrick)
      .expect(200)
      .then(({ body }) => body);
  }

  function putKubrick(kubrick) {
    return postKubrick(kubrick).then(kubrick => {
      return request
        .put(`/api/me/favorites/${kubrick._id}`)
        .set('Authorization', user.token)
        .expect(200)
        .then(({ body }) => body);
    });
  }

  it('puts a favorite kubrick film', () => {
    return postKubrick(kubrick).then(kubrick => {
      return request
        .put(`/api/me/favorites/${kubrick._id}`)
        .set('Authorization', user.token)
        .expect(200)
        .then(({ body }) => {
          expect(body.length).toBe(1);
          expect(body[0]).toEqual(kubrick._id);
        });
    });
  });

  it('gets a favorite kubrick film', () => {
    return putKubrick(kubrick).then(() => {
      return request
        .get('/api/me/favorites')
        .set('Authorization', user.token)
        .expect(200)
        .then(({ body }) => {
          expect(body[0]).toMatchInlineSnapshot(
            {
              _id: expect.any(String)
            },
            `
            Object {
              "_id": Any<String>,
              "title": "A Clockwork Orange",
            }
          `
          );
        });
    });
  });

  it('deletes a favorite kubrick movie', () => {
    return putKubrick(kubrick)
      .then(kubrick => {
        return request
          .delete(`/api/me/favorites/${kubrick[0]}`)
          .set('Authorization', user.token)
          .expect(200)
          .then(() => {
            return request
              .get('/api/me/favorites')
              .set('Authorization', user.token)
              .expect(200)
              .then(({ body }) => {
                expect(body.length).toBe(0);
              });
          });
      });
  });
});
