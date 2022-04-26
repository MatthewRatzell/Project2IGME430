const models = require('../models');
const BoardModel = require('../models/Board');

const { Board } = models;

const boardPage = (req, res) => res.render('boards');

const makeBoard = async (req, res) => {
  if (req.session.account.premium == '1') {

    if (!req.body.title) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const boardData = {
      title: req.body.title,
      owner: req.session.account._id,
    };
    try {
      const newBoard = new Board(boardData);
      await newBoard.save();
      return res.status(201).json({
        title: newBoard.title,

      });

    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Board already exists!' });
      }
      return res.status(400).json({ error: 'An error occured' });
    }
  }
  else {
    console.dir('Gimme ur bread bitch');
  }

};

const getBoards = (req, res) => BoardModel.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occured!' });
  }
  return res.json({ boards: docs });
});

const setCurrentBoard = async (req, res) => {

  const boardsTitle = `${req.body.title}`;
  const boardsID = `${req.body.boardsID}`;

  //console.dir(`Boards ID: ${boardsID}`);

  const doc = await BoardModel.findOne({ title: boardsTitle, owner: req.session.account }).exec();

  //console.dir(`Find One Id: ${doc._id}`);

  if (!doc) {
    return res.status(400).json({ error: 'Board is requred or is not actually a board' });
  }

  //set the boards for the tasks
  req.session.board = Board.toAPI(doc);



  return res.json({ redirect: '/taskBoard' });
};

module.exports = {
  boardPage,
  makeBoard,
  getBoards,
  setCurrentBoard

};
