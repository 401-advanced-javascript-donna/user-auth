const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
const { Schema } = mongoose;

const schema = new Schema({
  name: {
    type: String
  },
  type: { type: String },
  origin: {
    type: String,
  },
  year: {
    type: Number,
  }
});

module.exports = mongoose.model('Dog', schema);