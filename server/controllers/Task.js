const models = require('../models');

const { Task } = models;

// Renders app.handlebars
const makerPage = (req, res) => {
  Task.TaskModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), tasks: docs });
  });
};

// Adds a new task to the database
const makeTask = (req, res) => {
  // Checks to see that all fields were entered
  if (!req.body.name || !req.body.date || !req.body.description) {
    return res.status(400).json({ error: 'Error: All fields are required' });
  }

  const taskData = {
    name: req.body.name,
    date: req.body.date,
    description: req.body.description,
    owner: req.session.account._id,
  };

  // Loads task data into the model
  const newTask = new Task.TaskModel(taskData);

  const taskPromise = newTask.save();

  // Redirect to /maker when complete
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

// Returns all tasks for the active user
const getTasks = (request, response) => {
  const req = request;
  const res = response;

  return Task.TaskModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ tasks: docs });
  });
};

// Deletes a specific task based on name and description
const deleteTask = (request, response) => {
  const req = request;
  const res = response;

  return Task.TaskModel.deleteTask(req.session.account._id, req.body.name, req.body.description,
    (err, docs) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred' });
      }

      return res.json({ tasks: docs });
    });
};

module.exports.makerPage = makerPage;
module.exports.getTasks = getTasks;
module.exports.makeTask = makeTask;
module.exports.deleteTask = deleteTask;
