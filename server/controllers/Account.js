const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  // force cast to strings to cover some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'Error: All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'Error: All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Error: Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

const getUser = (request, response) => {
  const req = request;
  const res = response;
  return res.json({ username: req.session.account.username });
};

// Updates the users password and handles any errors
const changePass = (request, response) => {
  const req = request;
  const res = response;
  
  // cast to strings to cover up some security flaws
  const username = `${req.body.username}`;
  const currPass = `${req.body.currPass}`;
  const newPass = `${req.body.newPass}`;
  const newPass2 = `${req.body.newPass2}`;

  // Checks to see if all fields were entered
  if (!currPass || !newPass || !newPass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  // Checks to see if the new passwords match
  if (newPass !== newPass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  // Authenticates the old password
  // Throws an error if it does not match
  // Else, updates the password and redirects to /maker
  return Account.AccountModel.authenticate(username, currPass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Current Password does not match!' });
    }

    return Account.AccountModel.generateHash(newPass, (salt, hash) => {
      Account.AccountModel.findByUsername(username, (error, doc) => {
        if (error) {
          return res.status(400).json({ error: 'An unexpected error occurred.' });
        }

        if (!doc) {
          return res.status(400).json({ error: 'Account not found!' });
        }

        const currAccount = doc;
        currAccount.salt = salt;
        currAccount.password = hash;

        const savePromise = currAccount.save();

        savePromise.then(() => {
          req.session.account = Account.AccountModel.toAPI(currAccount);
          return res.json({ redirect: '/maker' });
        });

        return false;
      }); // findByUsername()
    }); // generateHash()
  }); // authenticate()
}; // changePass()

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getUser = getUser;
module.exports.changePass = changePass;
module.exports.getToken = getToken;
