const models = require('../models');
const TaskModel = require('../models/Taskboard');

const { Task } = models;

const taskPage = (req, res) => res.render('app');

const makeTask = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.height) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const taskData = {
    name: req.body.name,
    age: req.body.age,
    height: req.body.height,
    owner: req.session.account._id,
  };

  try {
    const newTask = new Task(taskData);
    await newTask.save();
    return res.status(201).json({ name: newTask.name, age: newTask.age, height: newTask.height });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Task already exists!' });
    }
    return res.status(400).json({ error: 'An error occured' });
  }
};

const getTasks = (req, res) => TaskModel.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occured!' });
  }
  return res.json({ Tasks: docs });
});



module.exports = {
  taskPage,
  makeTask,
  getTasks,

};
