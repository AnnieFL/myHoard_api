const Joi = require("joi");

const thingsSchemaCreate = Joi.object({
    name: Joi.string().required(),

    size: Joi.number(),

    age: Joi.alternatives(
        Joi.string(),
        Joi.date()
    ).allow(null),

    picture: Joi.string().max(150000).required(),

    categoryId: Joi.number().required()
});

const thingsSchemaEdit = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    size: Joi.number(),

    age: Joi.alternatives(
        Joi.string(),
        Joi.date()
    ).allow(null),

    picture: Joi.string(),

    categoryId: Joi.number().required()
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