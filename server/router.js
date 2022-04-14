const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getTasks', mid.requiresLogin, controllers.Taskboard.getTasks);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/taskBoard', mid.requiresLogin, controllers.Taskboard.taskPage);
  app.post('/taskBoard', mid.requiresLogin, controllers.Taskboard.makeTask);

  app.post('/updateTask', mid.requiresLogin, controllers.Taskboard.updateTask);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
