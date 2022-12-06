const { Router } = require('express');
const { isAuth } = require('../middlewares/isAuth');
const thingsRouter = Router();
const ThingsController = require('../controllers/thingsController');

const thingsController = new ThingsController();


thingsRouter.get('/latest', (req, res) => thingsController.latestThings(req, res));
thingsRouter.get('/list', isAuth, (req, res) => thingsController.listThings(req, res));
thingsRouter.get('/details/:id', isAuth, (req, res) => thingsController.detailThing(req, res));

thingsRouter.post('/create', isAuth, (req, res) => thingsController.createThing(req, res));

thingsRouter.put('/edit/:id', isAuth, (req, res) => isItself(req, res), (req, res) => thingsController.editThing(req, res));

thingsRouter.delete('/delete/:id', isAuth, (req, res) => isItself(req, res), (req, res) => thingsController.deleteThing(req, res));

module.exports = thingsRouter;