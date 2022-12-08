const { Router } = require('express');
const { isAuth } = require('../middlewares/isAuth');
const { isAllowed } = require('../middlewares/isAllowed');
const { isItself } = require('../middlewares/isItself')
const thingsRouter = Router();
const ThingsController = require('../controllers/thingsController');

const thingsController = new ThingsController();


thingsRouter.get('/latest', (req, res) => thingsController.latestThings(req, res));
thingsRouter.get('/list', isAuth, (req, res) => thingsController.listThings(req, res));
thingsRouter.get('/details/:id', isAuth, (req, res) => thingsController.detailThing(req, res));
thingsRouter.get('/submissions', isAuth, isAllowed("ADMIN"), (req, res) => thingsController.listSubmissions(req, res));

thingsRouter.post('/create', isAuth, (req, res) => thingsController.createThing(req, res));

thingsRouter.put('/edit/:id', isAuth, (req, res) => isItself(req, res), (req, res) => thingsController.editThing(req, res));
thingsRouter.put('/approve/:id', isAuth, isAllowed("ADMIN"), (req, res) => thingsController.approveThing(req, res));
thingsRouter.put('/deny/:id', isAuth, isAllowed("ADMIN"), (req, res) => thingsController.denyThing(req, res));

thingsRouter.delete('/delete/:id', isAuth, isAllowed("ADMIN"), (req, res) => thingsController.deleteThing(req, res));

module.exports = thingsRouter;