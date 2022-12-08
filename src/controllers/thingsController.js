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
                active: true,
                userId: req.user.id
            }
        });

        return res.json(things);
    }

    async latestThings(req, res) {
        const offset = req.query.offset ? req.query.offset : 0;
        if (parseInt(offset) != offset) {
            console.log(offset);
            res.status(400).json({msg: "Invalid offset value"});
        }

        const things = await ThingsModel.findAll({
            where: {active: true, verified: true},
            include: [{model: UsersModel, attributes: ["id", "name", "picture"], where: {active: true}}, {model: CategoriesModel, attributes: ["id", "name", "picture", "rarity"], where: {active: true}}],
            order: [["createdAt", "DESC"]],
            limit: 15,
            offset
        })

        res.status(200).json(things);
    }

    async detailThing(req, res) {
        const {id} = req.params;

        const thing = await ThingsModel.findOne({
            where: { id },
            include: [{ model: UsersModel, attributes: ["id", "name", "picture"] }, { model: CategoriesModel, attributes: ["id", "name", "picture", "rarity"] }],
            order: [["createdAt", "DESC"]]
        });

        res.status(200).json(thing);
    }

    async createThing(req, res) {
        const {name, picture, categoryId} = req.body;
        const size = req.body.size ? req.body.size : 0;
        const age = req.body.age ? req.body.age : null;
        const userId = req.user.id;


        const validationError = validateThing({ name, size, age, picture, categoryId }, "create");
        if (validationError) {
            console.log(validationError);
            return res.status(400).json({ validationError });
        }

        const category = await CategoriesModel.findOne({
            where: {
                id: categoryId
            }
        });
        if (!category) {
            return res.status(404).json({msg:"Category not found"});
        }

        const user = await UsersModel.findOne({
            where: {
                id: userId
            }
        });
        if (!user) {
            return res.status(404).json({msg: "User not found"});
        }
    
        const active = req.admin ? req.admin : false;

        const thing = await ThingsModel.create({ name, size, age, picture, active, verified: active, userId, categoryId});

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
            return res.status(404).json({msg:"Thing not found"});
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

        return res.status(200).json({msg:"Edited successfully"});
    }

    async deleteThing(req, res) {
        const id = req.params;

        const thing = await CategoriesModel.findOne({
            where: {
                id
            }
        })
        if (!thing) {
            return res.status(404).json({msg: "Thing not found"});
        }

        await CategoriesModel.update(
            {active: false},
            {
                where: {
                    id
                }
            }
        )

        return res.status(200).json({msg: "Deleted successfully"});

    }
}


module.exports = ThingsController;