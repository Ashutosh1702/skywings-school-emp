const { body, param, query } = require('express-validator');

// Validation rules for Student Management (Module 3)
const createStudentValidation = [
  body('admissionNumber')
    .trim()
    .notEmpty()
    .withMessage('Unique Admission Number is required')
    .isLength({ min: 3, max: 30 })
    .withMessage('Admission number must be between 3 and 30 characters'),
  body('rollNumber')
    .trim()
    .notEmpty()
    .withMessage('Roll Number is required'),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last Name is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  body('gender')
    .notEmpty()
    .withMessage('Gender is required')
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  body('dateOfBirth')
    .notEmpty()
    .withMessage('Date of Birth is required')
    .isISO8601()
    .withMessage('Date of birth must be a valid ISO date'),
  body('class')
    .notEmpty()
    .withMessage('Class assignment is required')
    .isMongoId()
    .withMessage('Class ID must be a valid MongoDB ObjectId'),
  body('section')
    .notEmpty()
    .withMessage('Section assignment is required')
    .isMongoId()
    .withMessage('Section ID must be a valid MongoDB ObjectId'),
  body('email')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('Student email must be valid if provided'),
];

const updateStudentValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Student ID format'),
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 }),
  body('email')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('Email must be valid'),
];

module.exports = {
  createStudentValidation,
  updateStudentValidation,
};

