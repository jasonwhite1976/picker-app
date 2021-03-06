const api_key = process.env.MAILGUN_API_KEY || process.env.MAILGUN_API_SANDBOX_KEY;
const domain  = process.env.DOMAIN;

const mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

/**
 * GET /contact
 * Contact form page.
 */
exports.getContact = (req, res) => {
  res.render('contact', {
    title: 'Contact'
  });
};

/**
 * POST /contact
 * Send a contact form via MailGun.
 */
exports.postContact = (req, res) => {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('message', 'Message cannot be blank').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/contact');
  }

  var emailData = {
    from: '"List Zapper" <noreply@listzapper.tk>', // sender address
    to: `jason@cbaseseven.com`,
    subject: 'Contact Form | List Zapper',
    text: req.body.message
  };

  mailgun.messages().send(emailData, function (err, body) {
    if (err) {
      req.flash('errors', { msg: err.message });
      return res.redirect('/contact');
    }
    req.flash('success', { msg: 'Email has been sent successfully!' });
    res.redirect('/contact');
  });
};
