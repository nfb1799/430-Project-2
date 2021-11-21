const models = require('../models');

const { Task } = models;

// maybe rename maker page
const makerPage = (req, res) => {
  Task.TaskModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), tasks: docs });
  });
};

const makeTask = (req, res) => {
  if (!req.body.name || !req.body.date || !req.body.description) {
    return res.status(400).json({ error: 'Error: All fields are required' });
  }

  const taskData = {
    name: req.body.name,
    date: req.body.date,
    description: req.body.description,
    owner: req.session.account._id,
  };

  const newTask = new Task.TaskModel(taskData);

  const taskPromise = newTask.save();

  taskPromise.then(() => res.json({ redirect: '/maker' }));

  taskPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Task already exists' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });
  
  return taskPromise;
};

const getTasks = (request, response) => {
  const req = request;
  const res = response;

  return Task.TaskModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    console.log(docs);
    return res.json({ tasks: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getTasks = getTasks;
module.exports.makeTask = makeTask;
