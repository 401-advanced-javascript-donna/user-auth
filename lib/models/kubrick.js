const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('./required-types');

const schema = new Schema({
  title: RequiredString,
  type: { type: String },
  owner: {
    type: Schema.Types.ObjextId,
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