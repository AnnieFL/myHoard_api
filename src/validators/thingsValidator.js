const Joi = require("joi");

const thingsSchemaCreate = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    size: Joi.number(),

    age: Joi.number(),

    photo: Joi.string()
});

const thingsSchemaEdit = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    size: Joi.number(),

    age: Joi.number(),

    photo: Joi.string()
})

const validateThing = (user, action) => {
    let validation;
    if (action === "create") {
        validation = thingsSchemaCreate.validate(user);
    } else if (action === "edit") {
        validation = thingsSchemaEdit.validate(user);
    }
    
    if (validation.error) {
        return validation.error;
    }
}

module.exports = { validateThing };