const models = require('../models');
const TaskModel = require('../models/Taskboard');

const { Task } = models;

const taskPage = (req, res) => res.render('app');

const makeTask = async (req, res) => {
  if (!req.body.title || !req.body.description || !req.body.dueDate) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const taskData = {
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate,
    owner: req.session.account._id,
  };

  try {
    const newTask = new Task(taskData);
    await newTask.save();
    return res.status(201).json({ title: newTask.title, description: newTask.description, dueDate: newTask.dueDate });
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
  return res.json({ tasks: docs });
});



module.exports = {
  taskPage,
  makeTask,
  getTasks,

};
