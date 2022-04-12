const mongoose = require('mongoose');
const _ = require('underscore');

let TaskModel = {};

const setTitle = (title) => _.escape(title).trim();

const TaskSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
    trim: true,
    set: setTitle,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },

});

TaskSchema.statics.toAPI = (doc) => ({
  name: doc.title,
  description: doc.description,
  dueDate: doc.dueDate,
});

TaskSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    // convert the string ownerId to an object id
    owner: mongoose.Types.ObjectId(ownerId),
  };
  return TaskModel.find(search).select('title description dueDate').lean().exec(callback);
};

TaskModel = mongoose.model('Task', TaskSchema);

module.exports = TaskModel;
