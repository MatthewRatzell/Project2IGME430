const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getTasks', mid.requiresLogin, controllers.Taskboard.getTasks);

  //for getting all the boards stored  on the account
  app.get('/getBoards', mid.requiresLogin, controllers.Board.getBoards);
  ////////
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  //how we check on the clientside if the current user has premium
  app.get('/checkPremium', mid.requiresLogin, controllers.Account.checkPremium);
  //much like login this is where we are gonna set our currently selected board in the session
  app.post('/setCurrentBoard',mid.requiresLogin,controllers.Board.setCurrentBoard);
  app.get('/taskBoard', mid.requiresLogin, controllers.Taskboard.taskPage);
  app.post('/taskBoard', mid.requiresLogin, controllers.Taskboard.makeTask);
  //loads board page
  app.get('/boards', mid.requiresLogin, controllers.Board.boardPage);
  //adds a board to the users account
  app.post('/boards', mid.requiresLogin, controllers.Board.makeBoard);
  ////////
  app.post('/updateTask', mid.requiresLogin, controllers.Taskboard.updateTask);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
