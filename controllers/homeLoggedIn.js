const bluebird = require('bluebird');
const crypto = bluebird.promisifyAll(require('crypto'));
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const auth =  require('../auth.json');
const passport = require('passport');
const User = require('../models/User');
const List = require('../models/List');

/**
 * GET /
 * Home page - logged in.
 */
 
/**
 * GET /new-edit-list
 */
exports.homepageWithLists = (req, res) => {
  // Get the users lists
  List
  .find({ user: req.user.id })
  .exec(function (err, lists) {
    if (err) return handleError(err);
    if (req.user) {
      res.render('home-logged-in', {
        title: 'Make/Edit a List',
        lists: lists
      });
    } else {
      return res.redirect('/');
    }
  });
};
