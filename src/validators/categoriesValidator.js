const Joi = require("joi");

const categoriesSchemaCreate = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    rarity: Joi.number().required(),

    id: Joi.number().required()
});

const categoriesSchemaEdit = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30),

    rarity: Joi.string(),

    id: Joi.number().required()
})

const validateCategory = (category, action) => {
    let validation;
    if (action === "create") {
        validation = categoriesSchemaCreate.validate(category);
    } else if (action === "edit") {
        validation = categoriesSchemaEdit.validate(category);
    }

    if (validation.error) {
        return validation.error;
    }
}

module.exports = { validateCategory };