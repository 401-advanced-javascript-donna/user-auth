// eslint-disable-next-line new-cap
const router = require('express').Router();
const Kubrick = require('../models/kubrick');

router
  .post('/', (req, res, next) => {
    req.body.owner = req.user.id;
    
    Kubrick.create(req.body)
      .then(kubrick => res.json(kubrick))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Kubrick.findById(req.params.id)
      .lean()
      .then(kubrick => res.json(kubrick))
      .catch(next);
  })

  .get('/', ({ query }, res, next) => {
    const findQuery = {};
    if(query.title) findQuery.title = query.title;
    if(query.cinematographer) findQuery.cinematographer = query.cinematographer;

    Kubrick.find(findQuery)
      .select()
      .lean()
      .then(kubricks => {
        res.json(kubricks);
      })
      .catch(next);
  })

  .put('/:id', ({ params, body, user }, res, next) => {
    Kubrick.updateOne({
      _id: params.id,
      owner: user.id
    }, body)
      .then(kubrick => res.json(kubrick))
      .catch(next);
  })

  .delete('/:id', ({ params, user }, res, next) => {
    Kubrick.findOneAndRemove({
      _id: params.id,
      owner: user.id
    })
      .then(kubrick => res.json(kubrick))
      .catch(next);
  });

module.exports = router;