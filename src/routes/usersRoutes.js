const { Router } = require('express');
const { isAuth } = require('../middlewares/isAuth');
const { isItself } = require('../middlewares/isItself');
const usersRouter = Router();
const UsersController = require('../controllers/usersController');


const usersController = new UsersController();


usersRouter.get('/list', (req, res) => usersController.listUsers(req, res));

usersRouter.post('/signin', (req, res) => usersController.signIn(req, res));
usersRouter.post('/login', (req, res) => usersController.logIn(req, res));

usersRouter.put('/edit/:email', isAuth, (req, res) => isItself(req, res), (req, res) => usersController.editUser(req, res));

usersRouter.delete('/delete/:email', isAuth, (req, res) => isItself(req, res), (req, res) => usersController.deleteUser(req, res));

module.exports = usersRouter;