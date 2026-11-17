const { body, param } = require('express-validator');

// Validation rules for Examination & Results (Module 9)
const createExamValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Examination name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Exam name must be between 3 and 100 characters'),
  body('examType')
    .optional()
    .isIn(['unit_test', 'mid_term', 'final_term', 'quarterly', 'practical', 'mock_test'])
    .withMessage('Invalid examination type selected'),
  body('class')
    .notEmpty()
    .withMessage('Class ID is required')
    .isMongoId()
    .withMessage('Class ID must be a valid MongoDB ObjectId'),
  body('startDate')
    .notEmpty()
    .withMessage('Start date is required')
    .isISO8601()
    .withMessage('Start date must be a valid ISO date'),
  body('endDate')
    .notEmpty()
    .withMessage('End date is required')
    .isISO8601()
    .withMessage('End date must be a valid ISO date'),
];

const submitMarksValidation = [
  param('id')
    .isMongoId()
    .withMessage('Exam ID must be a valid MongoDB ObjectId'),
  body('subjectId')
    .notEmpty()
    .withMessage('Subject ID is required')
    .isMongoId()
    .withMessage('Subject ID must be a valid MongoDB ObjectId'),
  body('marksList')
    .isArray({ min: 1 })
    .withMessage('Marks list must be a non-empty array of student scores'),
  body('marksList.*.student')
    .notEmpty()
    .isMongoId()
    .withMessage('Valid Student ID is required for each mark entry'),
  body('marksList.*.marksObtained')
    .notEmpty()
    .isFloat({ min: 0 })
    .withMessage('Marks obtained must be greater than or equal to 0'),
  body('marksList.*.maxMarks')
    .notEmpty()
    .isFloat({ min: 1 })
    .withMessage('Maximum marks must be greater than 0'),
];

module.exports = {
  createExamValidation,
  submitMarksValidation,
};

