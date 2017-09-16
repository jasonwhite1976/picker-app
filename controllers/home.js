// add categories somehow...
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
 * Home page.

exports.index = (req, res) => {
  res.render('home', {
    title: 'Home'
  });
};
*/
exports.index = (req, res) => {
  // Get the users lists
  if (req.user) {
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

        }
      });
  } else {
    res.render('home', {
      title: 'Home'
    });
  }
};

/**
 * GET /new-edit-list

exports.getNewList = (req, res) => {
  // Get the users lists
  List
  .find({ user: req.user.id })
  .exec(function (err, lists) {
    if (err) return handleError(err);
    if (req.user) {
      res.render('list/new-edit-list', {
        title: 'Make/Edit a List',
        lists: lists
      });
    } else {
      return res.redirect('/');
    }
  });
};
*/
