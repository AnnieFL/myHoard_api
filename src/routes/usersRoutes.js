const { Router } = require('express');
const { isAuth } = require('../middlewares/isAuth');
const { isItself } = require('../middlewares/isItself');
const usersRouter = Router();
const UsersController = require('../controllers/usersController');
const { isAllowed } = require('../middlewares/isAllowed');

const usersController = new UsersController();

usersRouter.get('/list', (req, res) => usersController.listUsers(req, res));
usersRouter.get('/top/:number', (req, res) => usersController.listTopUsers(req, res));
usersRouter.get('/info/:id', isAuth, (req, res) => usersController.info(req, res));

usersRouter.post('/signin', (req, res) => usersController.signIn(req, res));
usersRouter.post('/login', (req, res) => usersController.logIn(req, res));
usersRouter.post('/grantAdmin', isAuth, isAllowed("ADMIN"), (req, res) => usersController.grantAdmin(req,res));

usersRouter.put('/edit/:id', isAuth, isItself, (req, res) => usersController.editUser(req, res));

usersRouter.delete('/delete/:id', isAuth, isItself, (req, res) => usersController.deleteUser(req, res));

module.exports = usersRouter;