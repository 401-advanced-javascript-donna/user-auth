// file: make-admin.js
require('dotenv').config();
const connect = require('../lib/connect');
require('../lib/models/register-plugins');
const User = require('../lib/models/user');
const mongoose = require('mongoose');

connect(process.env.MONGODB_URI);
const userId = process.argv[2];

console.log('Making user', userId, 'admin');

// or maybe you have a User.addRole ...?
User.updateById(
  userId,
  { 
    $addToSet: { 
      roles: 'admin'
    }
  }
)
  .then(console.log)
  .catch(console.log)
  .finally(() => mongoose.connection.close());

// require('dotenv').config();
// const connect = require('../lib/connect');
// require('../lib/models/register-plugins');
// const User = require('../lib/models/user');
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// connect(process.env.MONGODB_URI);

// User.create({
//   email: 'admin@admin.com',
//   hash: bcrypt.hashSync('password', 8),
//   roles: []
// }).then(user => {
//   User.updateById(
//     user._id,
//     { 
//       $addToSet: { 
//         roles: 'admin'
//       }
//     }
//   )
//     .then(result => {
//       console.log(result);
//     })
//     .catch()
//     .finally(() => mongoose.connection.close());
// });