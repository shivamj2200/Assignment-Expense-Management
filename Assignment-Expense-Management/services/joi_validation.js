const Joi = require('joi');
const { joiPassword } = require('joi-password');

errorFucntion = (schema, req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    res.json({ message: error.details[0].message });
    return console.log(error.details[0].message);
  } else {
    return next();
  }
};

// login validation
exports.loginValidation = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'in'] },
      }),
    password: joiPassword.required(),
  });
  errorFucntion(schema, req, res, next);
};

// Regstration Validation
exports.createValidation = async function (req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(6).max(20).trim().required(),
    email: Joi.string().email({ tlds: { allow: false } }),
    password: joiPassword
      .string()
      .min(6)
      .max(10)
      .minOfLowercase(1)
      .minOfSpecialCharacters(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .required(),
    password2: Joi.ref('password'),
  });
  errorFucntion(schema, req, res, next);
};

// Update/reset Password
exports.updatePassword = (req, res, next) => {
  const schema = Joi.object({
    newpassword: joiPassword
      .string()
      .min(6)
      .max(10)
      .minOfLowercase(1)
      .minOfSpecialCharacters(1)
      .minOfUppercase(1)
      .minOfNumeric(1)
      .noWhiteSpaces()
      .required(),
    confirmpassword: Joi.required.ref('password'),
  });
  errorFucntion(schema, req, res, next);
};

// Create Expense Validation

exports.createExpenseValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    amount: Joi.number().required(),
    description: Joi.string().required().min(5),
    userID: Joi.string().require(),
    category: Joi.string().required(),
  });
  errorFucntion(schema, req, res, next);
};
