const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  listName:  String,
  items: Array
});

const List = mongoose.model('List', listSchema);

module.exports = List;


/*
aaron.save(function (err) {
  if (err) return handleError(err);

  var story1 = new Story({
    title: "Once upon a timex.",
    _creator: aaron._id    // assign the _id from the person
  });

  story1.save(function (err) {
    if (err) return handleError(err);
    // thats it!
  });
});
*/

// made the collection - won't add to it!!

// users go inside chats...
