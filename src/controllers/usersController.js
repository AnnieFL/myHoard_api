const { UsersModel } = require('../models/usersModel');
const Util = require('../classes/Util');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize')
const { validateUser } = require('../validators/usersValidator');
const {noIcon} = require("../config/constants");

const sequelize = new Sequelize(process.env.DB_URI, {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
});

require('dotenv').config()


class UsersController {

    constructor() {

    }

    async listUsers(req, res) {
        const users = await UsersModel.findAll({
            where: {
                active: true
            }
        })

        return res.json(users);
    }

    async listTopUsers(req, res) {
        const { number } = req.params

        const [users, metadata] = await sequelize.query(`
        SELECT
            users.name AS name,
            users.picture AS picture,
            sum(categories.points) AS score
        FROM
            "myHoard".users users
        LEFT JOIN "myHoard".things things ON
            things."userId" = users.id
            AND things.active = true
        LEFT JOIN "myHoard".categories categories ON
            categories.id = things."categoryId"
            AND categories.active = true
        WHERE
            users.active = true
        GROUP BY
            users.name, users.picture
        ORDER BY
            score DESC
        LIMIT ${number}
        `);

        return res.json(users);
    }

    async signIn(req, res) {
        const email = req.body.email.toLowerCase();
        const { name } = req.body;
        const password = await Util.encrypt(req.body.password);

        const validationError = validateUser({email, name, password}, "create");
        if (validationError) {
            return res.status(400).json({ validationError });
        }
        
        const user = await UsersModel.create({
            email, name, password, picture: noIcon, active: true
        });
        const token = jwt.sign(user.dataValues, process.env.JWT_SECRET)

        return res.status(201).json({ user: { id: user.id, email: user.email, name: user.name, picture: user.picture, permissions: user.permissions }, token});
    }

    async logIn(req, res) {
        const {name, password} = req.body;

        const validationError = validateUser({ name, password }, "login");
        if (validationError) {
            return res.status(400).json({ validationError });
        }

        const user = await UsersModel.findOne({
            where: {
                name
            }
        });

        const match = await Util.compare(password, user.password);

        if (!match) {
            return res.status(400).json({ msg: { pt: "Usuário e senha não se encaixam!", en: "Username and Password aren't matching!", go: "User, Password, Not match " } });
        }
        const token = jwt.sign(user.dataValues, process.env.JWT_SECRET)
        return res.json({user: {name: user.name, email: user.email, id: user.id, picture: user.picture, permissions: user.permissions}, token});
    }

    async grantAdmin(req, res) {
        const email = req.body.email.toLowerCase();

        const validationError = validateUser({email}, "grantAdmin");
        if (validationError) {
            return res.status(400).json({ validationError });
        }

        const user = await UsersModel.findOne({
            where: {
                email
            }
        })

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        await UsersModel.update(
            {permissions: ["ADMIN"]},
            {
                where: {
                    email
                }
            })

        return res.status(200).json({msg: "Admin permissions granted to user"});
    }

    async editUser(req, res) {
        const email = req.params.email.toLowerCase();
        
        const validationError = validateUser({ email, name: req.body.name, password: req.body.password ? req.body.password : "", picture: req.body.picture }, "edit");
        if (validationError) {
            return res.status(400).json({ validationError });
        }

        let user = await UsersModel.findOne({
            where: {
                email
            }
        })
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const {name} = req.body;
        const password = req.body.password ? Util.encrypt(req.body.password) : user.password;
        const picture = req.body.picture ? req.body.picture : user.picture;

        await UsersModel.update(
            { name, password, picture },
            {
                where: {
                    email
                }
            }
        )

        user = await UsersModel.findOne({
            where: {
                email
            }
        });

        const token = jwt.sign(user.dataValues, process.env.JWT_SECRET)

        return res.json({ user: { name: user.name, email: user.email, id: user.id, picture: user.picture, permissions: user.permissions }, token });
    }

    async deleteUser(req, res) {
        const email = req.params.email.toLowerCase();

        const user = await UsersModel.findOne({
            where: {
                email
            }
        })
        if (!user) {
            return res.status(404).json({ msg: { pt: "Usuário não encontrado", en: "User not found", go: "You are not you!" } });
        }

        await UsersModel.update(
            { active: false },
            {
                where: {
                    email
                }
            }
        )

        return res.status(200).json({ msg: { pt: "Apagado com sucesso", en: "Deleted successfully", go: "You don't exist!" } });

    }
}


module.exports = UsersController;