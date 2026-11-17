const { body, param } = require('express-validator');

// Validation rules for Fee Management & Payments (Module 8)
const recordPaymentValidation = [
  body('student')
    .notEmpty()
    .withMessage('Student ID is required')
    .isMongoId()
    .withMessage('Student ID must be a valid MongoDB ObjectId'),
  body('installmentNumber')
    .notEmpty()
    .withMessage('Installment number is required')
    .isInt({ min: 1, max: 12 })
    .withMessage('Installment number must be an integer between 1 and 12'),
  body('amount')
    .notEmpty()
    .withMessage('Payment amount is required')
    .isFloat({ min: 1 })
    .withMessage('Payment amount must be greater than zero INR'),
  body('paymentMethod')
    .notEmpty()
    .withMessage('Payment method is required')
    .isIn(['cash', 'card', 'upi', 'net_banking', 'cheque'])
    .withMessage('Invalid payment method selected'),
  body('transactionId')
    .optional({ checkFalsy: true })
    .trim(),
];

const createFeeStructureValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Fee structure title is required'),
  body('class')
    .notEmpty()
    .withMessage('Class is required')
    .isMongoId()
    .withMessage('Class ID must be a valid MongoDB ObjectId'),
  body('academicSession')
    .notEmpty()
    .withMessage('Academic session is required')
    .isMongoId()
    .withMessage('Academic session must be a valid MongoDB ObjectId'),
  body('totalAmount')
    .notEmpty()
    .isFloat({ min: 100 })
    .withMessage('Total fee amount must be at least ₹100'),
  body('breakdown')
    .isArray({ min: 1 })
    .withMessage('Fee breakdown array with at least one fee head is required'),
];

module.exports = {
  recordPaymentValidation,
  createFeeStructureValidation,
};

