const Joi = require("joi");

const usersSchemaCreate = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string().required(),

    email: Joi.string().email().required(),
});

const usersSchemaLogin = Joi.object({
    password: Joi.string().required(),

    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
});

const usersSchemaEdit = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30),

    password: Joi.string(),

    email: Joi.string().email().required()
})

const validateUser = (user, action) => {
    let validation;
    if (action === "create") {
        validation = usersSchemaCreate.validate(user);
    } else if (action === "edit") {
        validation = usersSchemaEdit.validate(user);
    } else if (action === "login") {
        validation = usersSchemaLogin.validate(user);
    }

    if (validation.error) {
        return validation.error;
    }
}

module.exports = { validateUser };