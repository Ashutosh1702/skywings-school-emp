const TransportRoute = require('../models/TransportRoute');
const { logAction } = require('../utils/auditLogger');

// @desc    Get all transport routes
// @route   GET /api/transport/routes
// @access  Private
const getRoutes = async (req, res, next) => {
  try {
    const routes = await TransportRoute.find().sort({ routeName: 1 });
    res.status(200).json({ success: true, count: routes.length, data: routes });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a transport route
// @route   POST /api/transport/routes
// @access  Private (Admin only)
const createRoute = async (req, res, next) => {
  try {
    const { routeName, vehicleNumber, driverName, driverPhone, vehicleCapacity, stops } = req.body;

    const existing = await TransportRoute.findOne({ routeName });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Route name already exists' });
    }

    const route = await TransportRoute.create({
      routeName,
      vehicleNumber: vehicleNumber.toUpperCase(),
      driverName,
      driverPhone,
      vehicleCapacity: vehicleCapacity || 32,
      stops: stops || [],
    });

    await logAction({
      userId: req.user._id,
      action: 'CREATE_TRANSPORT_ROUTE',
      entity: 'TransportRoute',
      entityId: route._id,
      details: { routeName, vehicleNumber },
    });

    res.status(201).json({ success: true, data: route });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a stop to a route
// @route   POST /api/transport/routes/:id/stops
// @access  Private (Admin only)
const addStop = async (req, res, next) => {
  try {
    const { stopName, pickupTime, dropTime, monthlyFee } = req.body;
    const route = await TransportRoute.findById(req.params.id);

    if (!route) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }

    route.stops.push({
      stopName,
      pickupTime,
      dropTime,
      monthlyFee: monthlyFee || 2500,
    });

    await route.save();

    await logAction({
      userId: req.user._id,
      action: 'ADD_TRANSPORT_STOP',
      entity: 'TransportRoute',
      entityId: route._id,
      details: { stopName },
    });

    res.status(200).json({ success: true, data: route });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRoutes,
  createRoute,
  addStop,
};

