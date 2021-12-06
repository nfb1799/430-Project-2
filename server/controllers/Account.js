const models = require('../models');

const { Account } = models;

// Renders login.handlebars
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

// Destroys the session and redirects to the main page
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// Authenticates login requests and handles errors
const login = (request, response) => {
  const req = request;
  const res = response;

  // force cast to strings to cover some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  // Checks to see both fields were entered
  if (!username || !password) {
    return res.status(400).json({ error: 'Error: All fields are required' });
  }

  // Authenticates login and redirects to /maker
  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

// Authenticates signup requests and saves the new account using a salt and hash
const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  // Checks to see that all fields were entered
  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'Error: All fields are required' });
  }

  // Checks to see that passwords match
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Error: Passwords do not match' });
  }

  // Generates password hash and loads account data into the database
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

// Returns the current username
const getUser = (request, response) => {
  const req = request;
  const res = response;
  return res.json({ username: req.session.account.username });
};

// Authenticates username changes and handles errors
const changeUsername = (request, response) => {
  const req = request;
  const res = response;

  // Cast to string
  const newUsername = `${req.body.newUsername}`;

  // Checks to see that a username was entered
  if (!newUsername) {
    return res.status(400).json({ error: 'Username is required!' });
  }

  // Finds the current account from the database and updates the username
  return Account.AccountModel.findByUsername(req.session.account.username, (error, doc) => {
    if (error) {
      return res.status(400).json({ error: 'An unexpected error occurred.' });
    }

    if (!doc) {
      return res.status(400).json({ error: 'Account not found!' });
    }

    const currAccount = doc;
    currAccount.username = newUsername;

    const savePromise = currAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(currAccount);
      return res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });

    return false;
  }); // findByUsername
}; // changeUsername

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

// Returns JSON of the csrfToken
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
module.exports.changeUsername = changeUsername;
module.exports.changePass = changePass;
module.exports.getToken = getToken;
