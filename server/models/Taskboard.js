const mongoose = require('mongoose');
const _ = require('underscore');

let TaskModel = {};

const setName = (name) => _.escape(name).trim();

const TaskSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  height: {
    type: Number,
    min: 0,
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
  name: doc.name,
  age: doc.age,
  height: doc.height,
});

TaskSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    // convert the string ownerId to an object id
    owner: mongoose.Types.ObjectId(ownerId),
  };
  return TaskModel.find(search).select('name age height').lean().exec(callback);
};

TaskModel = mongoose.model('Task', TaskSchema);

module.exports = TaskModel;
