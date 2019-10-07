// eslint-disable-next-line new-cap
const router = require('express').Router();
const Dog = require('../models/dog');
const ensureRole = require('../middleware/ensure-role');

router
  .post('/', ensureRole(), (req, res, next) => {
    req.body.owner = req.user.id;
    
    Dog.create(req.body)
      .then(dog => res.json(dog))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Dog.findById(req.params.id)
      .lean()
      .then(dog => res.json(dog))
      .catch(next);
  })

  .get('/', ({ query }, res, next) => {
    const findQuery = {};
    if(query.name) findQuery.name = query.name;
    if(query.origin) findQuery.origin = query.origin;

    Dog.find(findQuery)
      .select()
      .lean()
      .then(dogs => {
        res.json(dogs);
      })
      .catch(next);
  })

  .put('/:id', ensureRole(), ({ params, body, user }, res, next) => {
    Dog.updateOne({
      _id: params.id,
      owner: user.id
    }, body)
      .then(dog => res.json(dog))
      .catch(next);
  })

  .delete('/:id', ensureRole(), ({ params, user }, res, next) => {
    Dog.findOneAndRemove({
      _id: params.id,
      owner: user.id
    })
      .then(dog => res.json(dog))
      .catch(next);
  });

module.exports = router;