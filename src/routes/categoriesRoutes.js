const { Router } = require('express');
const { isAuth } = require('../middlewares/isAuth');
const { isAllowed } = require('../middlewares/isAllowed');
const categoriesRouter = Router();
const CategoriesController = require('../controllers/categoriesController')

const categoriesController = new CategoriesController();


categoriesRouter.get('/list', (req, res) => categoriesController.listCategories(req, res));

categoriesRouter.post('/create', isAuth, (req, res) => categoriesController.createCategory(req, res));

categoriesRouter.put('/edit/:id', isAuth, isAllowed("DELETE_CATEGORY"), (req, res) => categoriesController.editCategory(req, res));

categoriesRouter.delete('/delete/:id', isAuth, isAllowed("DELETE_CATEGORY"), (req, res) => categoriesController.deleteCategory(req, res));

module.exports = categoriesRouter;