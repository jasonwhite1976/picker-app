const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  listName:  String,
  items: [
    {
      name       : String,
      isPicked   : Number,
    }
  ]
});

const List = mongoose.model('List', listSchema);

module.exports = List;
