const models = require('../models');
const AccountModel = require('../models/Account');

const { Account, Board } = models;

// every req creats a csrf token because set up combine with sessionkey
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

// function to get the token for a specific request
const getToken = (req, res) => res.json({ csrfToken: req.csrfToken() });
const logout = (req, res) => {
  // make sure we destroy mcookies on the schmove
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const premium = `${req.body.premium}`;

  if (!username || !pass || !premium) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(400).json({ error: 'All fields are required!(server side)' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/boards' });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;
  const premium = `${req.body.premium}`;

  if (!username || !pass || !pass2 || !premium) {
    return res.status(400).json({ error: 'All fields are required!(server side)' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  try {
    const hash = await Account.generateHash(pass);

    const newAccount = new Account({ username, password: hash, premium });
    await newAccount.save();

    req.session.account = Account.toAPI(newAccount);

    // this is where we will generate the first board for the user automatically
    const boardData = {
      title: `${req.session.account.username}s Personal Taskboard`,
      owner: req.session.account._id,
    };

    const newBoard = new Board(boardData);
    await newBoard.save();
    /// /////////////////////////////////////////////////////////////////////////////////
    /// /////////////////////////////////////////////////////////////////////////////////

    return res.json({ redirect: '/boards' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use' });
    }
    return res.status(400).json({ error: 'An error occured' });
  }
};

const checkPremium = (req, res) => res.json({ premiumStatus: req.session.account.premium });

// does nothing atm just setting it up
const makePremium = async (req, res) => {
  // to shut the fucking linters mouth
  await AccountModel.updateOne(
    // first give it the filter or a way to find the object
    { _id: req.session.account._id },
    {
      // now change the values we need to change
      $set: { premium: '1' },
    },
  );
  return res.status(200);
};
module.exports = {
  loginPage,
  login,
  logout,
  signup,
  getToken,
  checkPremium,
  makePremium,
};
