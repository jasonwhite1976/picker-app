const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  list: {
    name: String
  }
}
);

listSchema.pre('save', function save(next) {
  const list = this;
});

const List = mongoose.model('List', listSchema);

module.exports = List;
