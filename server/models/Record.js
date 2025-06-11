const { Schema, model } = require('mongoose');

const recordSchema = new Schema({
  artist: {
    type: String,
    required: true,
  },
  album: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Record = model('Record', recordSchema);
module.exports = Record;
