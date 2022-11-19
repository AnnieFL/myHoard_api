const { ThingsModel } = require('../models/thingsModel');
const { validateThing } = require('../validators/thingsValidator');
const { CategoriesModel } = require('../models/categoriesModel');
const { UsersModel } = require('../models/usersModel');

class ThingsController {

    constructor() {

    }

    async listThings(req, res) {
        const things = await ThingsModel.findAll({
            where: {
                active: true
            }
        });

        return res.json(things);
    }


    async createThing(req, res) {
        const {name, size, age, photo} = req.body;
        const userId = req.user.id;
        const {categoryId} = req.params;


        const validationError = validateThing({name, size, age, photo}, "create");
        if (validationError) {
            return res.status(400).json({ validationError });
        }

        const category = await CategoriesModel.findOne({
            where: {
                id: categoryId
            }
        });
        if (!category) {
            return res.status(404).json({msg: {pt: "Categoria não encontrada", en: "Category not found", go: "Category is not real!"}});
        }

        const user = await UsersModel.findOne({
            where: {
                id: userId
            }
        });
        if (!user) {
            return res.status(404).json({msg: {pt: "Usuário não encontrado", en: "User not found", go: "You are not you!"}});
        }
    
        const active = req.admin ? req.admin : false;

        const thing = await ThingsModel.create({name, size, age, photo, active, verified: active, userId, categoryId});

        return res.status(201).json(thing);
    }

    async editThing(req, res) {
        const id = req.params;

        const validationError = validateThing({name: req.body.name, size: req.body.size, age: req.body.age, photo: req.body.photo}, "edit");
        if (validationError) {
            return res.status(400).json({ validationError });
        }
        
        const thing = await ThingsModel.findOne({
            where: {
                id
            }
        })
        if (!thing) {
            return res.status(404).json({msg: {pt: "Coisa não encontrada", en: "Thing not found", go: "Thing is not real!"}});
        }
        
        const name = req.body.name ? req.body.name : thing.name;
        const size = req.body.size ? req.body.size : thing.size;
        const age = req.body.age ? req.body.age : thing.age;
        const photo = req.body.photo ? req.body.photo : thing.photo;
        const active = req.admin ? req.admin : false;

        await ThingsModel.update(
            {name, size, age, photo, active, verified: active},
            {
                where: {
                    id
                }
            }
        )

        return res.status(200).json({msg: {pt: "Alterado com sucesso", en: "Edited successfully", go: "Category changed!"}});
    }

    async deleteThing(req, res) {
        const id = req.params;

        const thing = await CategoriesModel.findOne({
            where: {
                id
            }
        })
        if (!thing) {
            return res.status(404).json({msg: {pt: "Coisa não encontrada", en: "Thing not found", go: "Thing is not real!"}});
        }

        await CategoriesModel.update(
            {active: false},
            {
                where: {
                    id
                }
            }
        )

        return res.status(200).json({msg: {pt: "Apagado com sucesso", en: "Deleted successfully", go: "Category don't exist!"}});

    }
}


module.exports = ThingsController;