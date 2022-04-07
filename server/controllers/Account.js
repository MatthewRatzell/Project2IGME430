const models = require('../models');

const { Account } = models;
// every req creats a csrf token because set up combine with sessionkey
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

//function to get the token for a specific request
const getToken = (req, res) => res.json({ csrfToken: req.csrfToken() });
const logout = (req, res) => {
  // make sure we destroy mcookies on the schmove
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(400).json({ error: 'All fields are required!' });
    }
    req.session.account = Account.toAPI(account);
    return res.json({ redirect: '/taskBoard' });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/taskBoard' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use' });
    }
    return res.status(400).json({ error: 'An error occured' });
  }
};

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  getToken,
};