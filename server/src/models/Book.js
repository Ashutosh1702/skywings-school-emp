const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    isbn: {
      type: String,
      required: [true, 'ISBN / Book Code is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
    },
    publisher: {
      type: String,
      default: '',
    },
    rackNumber: {
      type: String,
      default: 'Rack A-1',
    },
    totalCopies: {
      type: Number,
      required: true,
      min: 1,
      default: 5,
    },
    availableCopies: {
      type: Number,
      required: true,
      min: 0,
      default: 5,
    },
    status: {
      type: String,
      enum: ['available', 'out_of_stock'],
      default: 'available',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);

