const Joi = require("joi");
const validator = require("../../middleware/validator");
module.exports = {
  createRole: validator({
    body: Joi.object({
      name: Joi.string().required()
    }),
  }),
};
