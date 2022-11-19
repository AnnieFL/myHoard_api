const { UsersModel } = require('../models/usersModel');
const Util = require('../classes/Util');
const jwt = require('jsonwebtoken');
const { validateUser } = require('../validators/usersValidator');
require('dotenv').config()


class UsersController {

    constructor() {

    }

    async listUsers(req, res) {
        const users = await UsersModel.findAll({
            where: {
                active: true
            }
        });

        return res.json(users);
    }


    async signIn(req, res) {
        const email = req.body.email.toLowerCase();
        const {name} = req.body;
        const password = Util.encrypt(req.body.password);

        const validationError = validateUser(user, "create");
        if (validationError) {
            return res.status(400).json({ validationError });
        }

        const user = await UsersModel.create({
            email, name, password, active: true
        });

        return res.status(201).json(user);
    }

    async logIn(req, res) {
        const email = req.body.email.toLowerCase();
        const password = Util.encrypt(req.body.password);

        const validationError = validateUser({email, password}, "login");
        if (validationError) {
            return res.status(400).json({ validationError });
        }

        const user = await UsersModel.findOne({
            where: {
                email
            }
        });

        const match = await Util.compare(password, user.password);

        if (!match) {
            return res.status(400).json({ msg: {pt: "Usuário e senha não se encaixam!", en: "Username and Password aren't matching!", go: "User, Password, Not match "} });
        }
        const token = jwt.sign(user.dataValues, process.env.JWT_SECRET)
        return res.json(token);
    }

    async editUser(req, res) {
        const email = req.params.email.toLowerCase();

        const validationError = validateUser({email, name: req.body.name, password: req.body.password}, "edit");
        if (validationError) {
            return res.status(400).json({ validationError });
        }
        
        const user = await UsersModel.findOne({
            where: {
                email
            }
        })
        if (!user) {
            return res.status(404).json({msg: {pt: "Usuário não encontrado", en: "User not found", go: "You are not you!"}});
        }
        
        const name = req.body.name ? req.body.name : user.name;
        const password = req.body.password ? Util.encrypt(req.body.password) : user.password;
        const permissions = req.body.permissions && req.body.permissions[0] ? req.body.permissions : user.permissions;

        await UsersModel.update(
            {name, password, permissions},
            {
                where: {
                    email
                }
            }
        )

        return res.status(200).json({msg: {pt: "Alterado com sucesso", en: "Edited successfully", go: "You changed!"}});
    }

    async deleteUser(req, res) {
        const email = req.params.email.toLowerCase();

        const user = await UsersModel.findOne({
            where: {
                email
            }
        })
        if (!user) {
            return res.status(404).json({msg: {pt: "Usuário não encontrado", en: "User not found", go: "You are not you!"}});
        }

        await UsersModel.update(
            {active: false},
            {
                where: {
                    email
                }
            }
        )

        return res.status(200).json({msg: {pt: "Apagado com sucesso", en: "Deleted successfully", go: "You don't exist!"}});

    }
}


module.exports = UsersController;