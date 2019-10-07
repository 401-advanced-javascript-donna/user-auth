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

  function postKubrick() {
    return request
      .post('/api/kubricks')
      .set('Authorization', user.token)
      .send(kubrick)
      .expect(200)
      .then(({ body }) => body);
  }

  it('gets kubrick film by id', () => {
    return postKubrick(kubrick)
      .then(kubrick => {
        return request
          .get(`/api/kubricks/${kubrick._id}`)
          .set('Authorization', user.token)
          .expect(200);
      })
      .then(({ body }) => {
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

  it('gets a list of kubrick films', () => {
    const firstdata = {
      title: 'A Clockwork Orange',
      writers: ['Stanley Kubrick', 'Anthony Burgess'],
      cinematographer: 'John Alcott',
      yearRelease: 1971
    };
    return Promise.all([
      postKubrick(firstdata),
      postKubrick({ title: 'Lolita', yearRelease: 1962 }),
      postKubrick({ title: 'Spartacus', yearRelease: 1960 })
    ])
      .then(() => {
        return request
          .get('/api/kubricks')
          .set('Authorization', user.token)
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.length).toBe(3);
        expect(body[0]).toMatchInlineSnapshot(
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

  it('updates a kubrick film', () => {
    return postKubrick(kubrick)
      .then(kubrick => {
        kubrick.title = 'Shining';
        return request
          .put(`/api/kubricks/${kubrick._id}`)
          .set('Authorization', user.token)
          .send(kubrick)
          .expect(200);
      })
      .then(({ body }) => {
        expect(body.title).toBe('Shining');
      });
  });

  it('deletes a kubrick film', () => {
    return postKubrick(kubrick).then(kubrick => {
      return request
        .delete(`/api/kubricks/${kubrick._id}`)
        .set('Authorization', user.token)
        .expect(200);
    });
  });
});
