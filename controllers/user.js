// routes - categories
const bluebird = require('bluebird');
const crypto = bluebird.promisifyAll(require('crypto'));
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const auth =  require('../auth.json');
const passport = require('passport');
const User = require('../models/User');
const List = require('../models/List');

/**
 * GET /new-edit-list
 */
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

/**
 * POST /new-edit-list
 */
exports.postNewList = (req, res, next) => {
  req.assert('name', 'New list name must be at least 3 characters long').len(3);
  req.sanitize('name');
  const errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/list/new-edit-list');
  }
  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    var list = new List({
      user: req.user.id,
      listName : req.body.name
    });
    list.save((err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: req.body.name + ' created' });
      res.redirect('/list/new-edit-list');
    });
  });
}

/**
 * POST /add-item-to-list
 */
exports.postItemToList = (req, res, next) => {
  //req.assert(req.body.name, 'New item name must be at least 3 characters long').len(3);
  //req.sanitize('itemName');
  const errors = req.validationErrors();
  if (errors) { req.flash('errors', errors); }

  var theDateNow = Date.now();
  var itemName = req.body.name;
  var isItemPicked = 0;

  var listURL = req.originalUrl;
  listURL = listURL.split('/');
  listURL = listURL[listURL.length-1];

  var item = {
      name       : itemName,
      isPicked   : isItemPicked
  };

  List.findByIdAndUpdate(
    listURL,
    { $push: {items: item } },
    { safe: true, upsert: true
    }, (err) => {
       if (err) { return next(err); }
         res.send(JSON.stringify({
           name: itemName || null,
         }));
    });
}

/**
 * POST /edit-item - update isPicked...
 */
exports.updateItem = (req, res, next) => {
  var itemName = req.body.name;
  var isPicked = req.body.picked;
  console.log("isPicked " + isPicked);

  var item_id = req.body.item_id;
  console.log("item_id " + item_id);

  var listURL = req.originalUrl;
  listURL = listURL.split('/');
  listURL = listURL[listURL.length-1];

  List.update(
    { _id: listURL, "items._id": item_id },
    { '$set': { "items.$.isPicked": isPicked } },
    (err) => {
     if (err) { return next(err); }
       res.send(JSON.stringify({
        name: itemName || null,
        isPicked: isPicked
      }));
  });

}

/**
 * POST /delete-item-from-list *
 */
exports.deleteItemFromList = (req, res, next) => {
  //req.sanitize('name');
  const errors = req.validationErrors();
  if (errors) { req.flash('errors', errors); }

  var item_id = req.body._id;

  console.log("item_id " + item_id);

  var listURL = req.originalUrl;
  listURL = listURL.split('/');
  listURL = listURL[listURL.length-1];

  List.update(
    { _id: listURL },
    { $pull: { items: { _id: item_id  } } },
    { safe: true },
    (err) => {
    if (err) { return next(err); }
    res.send(JSON.stringify({
          // name: req.body.createdOn || null,
    }));
  });
}

/**
 * Get
 */
exports.getListURL = (req, res, next) => {
  var listURL = req.originalUrl;
  listURL = listURL.split('/');
  listURL = listURL[listURL.length-1];

  List.findById(listURL, (err, list) => {
    if (err) { return next(err); }
    console.log(list.listName);
    res.render('list/show-list', {
      title: list.listName,
      listItems: list.items
    });
  });
};

/**
 * Get
 */
exports.getEditList = (req, res) => {
  if (req.user) {
    res.render('list/edit-list', {
      title: 'Edit a List'
    });
  } else {
    return res.redirect('/');
  }
};

/**
 * POST /list/delete
 */
exports.postDeleteList = (req, res, next) => {
  List.remove({ _id: req.body.name }, (err) => {
    if (err) { return next(err); }
    res.redirect('/list/new-edit-list');
  });
};

/****************************************************************/

/**
 * GET /login
 */
exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/login', {
    title: 'Login'
  });
};

/**
 * POST /login
 */
exports.postLogin = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/login');
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      req.flash('errors', info);
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: 'Success! You are logged in.' });
      res.redirect(req.session.returnTo || '/');
    });
  })(req, res, next);
};

/**
 * GET /logout
 */
exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

/**
 * GET /signup
 */
exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/signup', {
    title: 'Create Account'
  });
};

/**
 * POST /signup
 */
exports.postSignup = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/signup');
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password
  });

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that email address already exists.' });
      return res.redirect('/signup');
    }
    user.save((err) => {
      if (err) { return next(err); }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
      });
      req.flash('success', { msg: 'Signup Success! Welcome to Picker.' });
      res.redirect('/');

      var transporter = nodemailer.createTransport(mg(auth));

      const mailOptions = {
        to: user.email,
        from: '"Furnace1" <noreply@furnace1.tk>', // sender address
        subject: 'Welcome to Furnace1',
        text: `Hello,\n\nWelcome to Furnace1\n`
      };
      return transporter.sendMail(mailOptions)
        .then(() => {
          req.flash('success', { msg: 'Signup Success! Welcome to Picker.' });
        });
    });
  });
};

/**
 * GET /account
 */
exports.getAccount = (req, res) => {
  res.render('account/profile', {
    title: 'Account Management'
  });
};

/**
 * POST /account/profile
 */
exports.postUpdateProfile = (req, res, next) => {
  req.assert('email', 'Please enter a valid email address.').isEmail();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.email = req.body.email || '';
    user.profile.name = req.body.name || '';
    user.profile.gender = req.body.gender || '';
    user.profile.location = req.body.location || '';
    user.profile.website = req.body.website || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' });
          return res.redirect('/account');
        }
        return next(err);
      }
      req.flash('success', { msg: 'Profile information has been updated.' });
      res.redirect('/account');
    });
  });
};

/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = (req, res, next) => {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.password = req.body.password;
    user.save((err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: 'Password has been changed.' });
      res.redirect('/account');
    });
  });
};

/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = (req, res, next) => {
  User.remove({ _id: req.user.id }, (err) => {
    if (err) { return next(err); }
    req.logout();
    req.flash('info', { msg: 'Your account has been deleted.' });
    res.redirect('/');
  });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = (req, res, next) => {
  const provider = req.params.provider;
  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user[provider] = undefined;
    user.tokens = user.tokens.filter(token => token.kind !== provider);
    user.save((err) => {
      if (err) { return next(err); }
      req.flash('info', { msg: `${provider} account has been unlinked.` });
      res.redirect('/account');
    });
  });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  User
    .findOne({ passwordResetToken: req.params.token })
    .where('passwordResetExpires').gt(Date.now())
    .exec((err, user) => {
      if (err) { return next(err); }
      if (!user) {
        req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
        return res.redirect('/forgot');
      }
      res.render('account/reset', {
        title: 'Password Reset'
      });
    });
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.postReset = (req, res, next) => {
  req.assert('password', 'Password must be at least 4 characters long.').len(4);
  req.assert('confirm', 'Passwords must match.').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('back');
  }

  const resetPassword = () =>
    User
      .findOne({ passwordResetToken: req.params.token })
      .where('passwordResetExpires').gt(Date.now())
      .then((user) => {
        if (!user) {
          req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
          return res.redirect('back');
        }
        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        return user.save().then(() => new Promise((resolve, reject) => {
          req.logIn(user, (err) => {
            if (err) { return reject(err); }
            resolve(user);
          });
        }));
      });

  const sendResetPasswordEmail = (user) => {
    if (!user) { return; }

    var transporter = nodemailer.createTransport(mg(auth));

    const mailOptions = {
      to: user.email,
      from: '"Furnace1" <noreply@furnace1.tk>', // sender address
      subject: 'Your password has been changed',
      text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
    };
    return transporter.sendMail(mailOptions)
      .then(() => {
        req.flash('success', { msg: 'Success! Your password has been changed.' });
      });
  };

  resetPassword()
    .then(sendResetPasswordEmail)
    .then(() => { if (!res.finished) res.redirect('/'); })
    .catch(err => next(err));
};

/**
 * GET /forgot
 * Forgot Password page.
 */
exports.getForgot = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('account/forgot', {
    title: 'Forgot Password'
  });
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = (req, res, next) => {
  req.assert('email', 'Please enter a valid email address.').isEmail();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/forgot');
  }

  const createRandomToken = crypto
    .randomBytesAsync(16)
    .then(buf => buf.toString('hex'));

  const setRandomToken = token =>
    User
      .findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash('errors', { msg: 'Account with that email address does not exist.' });
        } else {
          user.passwordResetToken = token;
          user.passwordResetExpires = Date.now() + 3600000; // 1 hour
          user = user.save();
        }
        return user;
      });

  const sendForgotPasswordEmail = (user) => {
    if (!user) { return; }
    const token = user.passwordResetToken;

    var transporter = nodemailer.createTransport(mg(auth));

    const mailOptions = {
      to: user.email,
      from: '"Furnace1" <noreply@furnace1.tk>', // sender address
      subject: 'Reset your password on Hackathon Starter',
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://www.furnace1.tk /reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };
    return transporter.sendMail(mailOptions)
      .then(() => {
        req.flash('info', { msg: `An e-mail has been sent to ${user.email} with further instructions.` });
      });
  };

  //${req.headers.host}

  createRandomToken
    .then(setRandomToken)
    .then(sendForgotPasswordEmail)
    .then(() => res.redirect('/forgot'))
    .catch(next);
};
