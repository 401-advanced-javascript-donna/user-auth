const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
const { Schema } = mongoose;
const { RequiredString } = require('./required-types');

const schema = new Schema({
  name: RequiredString,
  type: { type: String },
  origin: {
    type: String,
  },
  year: {
    type: Number,
  }
});

module.exports = mongoose.model('Dog', schema);