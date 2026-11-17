const mongoose = require('mongoose');

const transportRouteSchema = new mongoose.Schema(
  {
    routeName: {
      type: String,
      required: [true, 'Route name is required (e.g. Route 4 - Whitefield Express)'],
      unique: true,
      trim: true,
    },
    vehicleNumber: {
      type: String,
      required: [true, 'Vehicle plate number is required'],
      trim: true,
      uppercase: true,
    },
    driverName: {
      type: String,
      required: [true, 'Driver name is required'],
      trim: true,
    },
    driverPhone: {
      type: String,
      required: [true, 'Driver phone is required'],
      trim: true,
    },
    vehicleCapacity: {
      type: Number,
      default: 32,
    },
    stops: [
      {
        stopName: { type: String, required: true },
        pickupTime: { type: String, required: true },
        dropTime: { type: String, required: true },
        monthlyFee: { type: Number, default: 2500 },
      },
    ],
    status: {
      type: String,
      enum: ['active', 'maintenance', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TransportRoute', transportRouteSchema);

