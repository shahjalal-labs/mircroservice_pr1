//
const Joi = require("joi");

const validateCreatePost = (data) => {
  const schema = Joi.object({
    content: Joi.string().min(10),
    mediaIds: Joi.array(),
  });

  return schema.validate(data);
};

module.exports = { validateCreatePost };
