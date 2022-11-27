const { Router } = require('express');
const { isAuth } = require('../middlewares/isAuth');
const thingsRouter = Router();
const ThingsController = require('../controllers/thingsController');

const thingsController = new ThingsController();


thingsRouter.get('/list', (req, res) => thingsController.listThings(req, res));
thingsRouter.get('/latest', (req, res) => thingsController.latestThings(req, res));

thingsRouter.post('/create', (req, res) => thingsController.createThing(req, res));

thingsRouter.put('/edit/:id', isAuth, (req, res) => isItself(req, res), (req, res) => thingsController.editThing(req, res));

thingsRouter.delete('/delete/:id', isAuth, (req, res) => isItself(req, res), (req, res) => thingsController.deleteThing(req, res));

module.exports = thingsRouter;