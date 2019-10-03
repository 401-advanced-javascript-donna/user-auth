const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('./required-types');

const schema = new Schema({
  title: RequiredString,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  synopsis: {
    type: String,
    max: 200
  },
  writers: [{
    type: String
  }],
  cinematographer: {
    type: String
  },
  yearRelease: {
    type: Number
  },
});

module.exports = mongoose.model('Kubrick', schema);