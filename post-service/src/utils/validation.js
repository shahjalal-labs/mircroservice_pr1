//
const Joi = require("joi");

const createPost = (data) => {
  const schema = Joi.object({
    content: Joi.string().min(10),
    mediaIds: Joi.array(Joi.string()),
  });

  return schema.validate(data);
};

const validatelogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};
module.exports = { validateRegistration: createPost, validatelogin };
