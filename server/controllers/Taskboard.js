const models = require('../models');
const TaskModel = require('../models/Taskboard');

const { Task } = models;

const taskPage = (req, res) => res.render('app');

const makeTask = async (req, res) => {
  if (!req.body.title || !req.body.description || !req.body.dueDate || !req.body.currentSpot) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const taskData = {
    title: req.body.title,
    description: req.body.description,
    currentSpot: req.body.currentSpot,
    dueDate: req.body.dueDate,
    owner: req.session.board._id,
  };

  try {
    const newTask = new Task(taskData);
    await newTask.save();
    return res.status(201).json({
      title: newTask.title,
      description: newTask.description,
      currentSpot: newTask.currentSpot,
      dueDate: newTask.dueDate,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Task already exists!' });
    }
    return res.status(400).json({ error: 'An error occured' });
  }
};

const getTasks = (req, res) => TaskModel.findByOwner(req.session.board._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occured!' });
  }
  return res.json({ tasks: docs });
});

// does nothing atm just setting it up
const updateTask = async (req, res) => {
  const cardToUpdate = req.body.title;
  const newSpotOnBoard = req.body.newSpot;
  // to shut the fucking linters mouth
  await TaskModel.updateOne(
    // first give it the filter or a way to find the object
    { title: cardToUpdate, owner: req.session.board },
    {
      // now change the values we need to change
      $set: { currentSpot: `${newSpotOnBoard}` },
    },
  );
  return res.status(200).json({ result: 'Task Successfully updated' });
};

const deleteTask = async (req, res) => {
  const cardToUpdate = req.body.title;
  // to shut the fucking linters mouth
  await TaskModel.deleteOne({ title: cardToUpdate, owner: req.session.board });

  return res.status(200);
};
module.exports = {
  taskPage,
  makeTask,
  getTasks,
  updateTask,
  deleteTask,

};
