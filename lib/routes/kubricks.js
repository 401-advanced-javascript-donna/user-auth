// eslint-disable-next-line new-cap
const router = require('express').Router();
const Kubrick = require('../models/kubrick');

router
  .post('/', (req, res, next) => {
    req.body.owner = req.user.id;
    
    Kubrick.create(req.body)
      .then(kubrick => res.json(kubrick))
      .catch(next);
  });

module.exports = router;