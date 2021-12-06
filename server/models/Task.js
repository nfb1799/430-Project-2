const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let TaskModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  date: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
    trim: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    require: true,
    ref: 'Account',
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// Translates Tasks to JSON format
TaskSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  date: doc.date,
  description: doc.description,
});

// Returns tasks for a specific user
TaskSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return TaskModel.find(search).select('name date description').lean().exec(callback);
};

// Deletes a specific task based on owner, name, and description
TaskSchema.statics.deleteTask = (ownerId, name, description, callback) => {
  const search = {
    owner: convertId(ownerId),
    name,
    description,
  };

  return TaskModel.deleteOne(search, callback);
};

TaskModel = mongoose.model('Task', TaskSchema);

module.exports.TaskModel = TaskModel;
module.exports.TaskSchema = TaskSchema;
