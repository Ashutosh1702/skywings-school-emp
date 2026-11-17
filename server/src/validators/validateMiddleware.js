const { validationResult } = require('express-validator');

/**
 * Reusable validation middleware that checks express-validator rules
 * and returns formatted HTTP 400 Bad Request if validation constraints fail.
 */
const validate = (validations) => {
  return async (req, res, next) => {
    for (const validation of validations) {
      await validation.run(req);
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));

    return res.status(400).json({
      success: false,
      message: formattedErrors[0]?.message || 'Validation error',
      errors: formattedErrors,
    });
  };
};

module.exports = { validate };

