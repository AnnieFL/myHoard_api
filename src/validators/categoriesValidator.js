const Joi = require("joi");

const categoriesSchemaCreate = Joi.object({
    name: Joi.string().required(),

    rarity: Joi.number().required(),

    pictureLocked: Joi.string(),

    pictureUnlocked: Joi.string(),

    points: Joi.number()
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