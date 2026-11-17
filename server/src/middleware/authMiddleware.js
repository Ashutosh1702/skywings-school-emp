const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Support development demo tokens seamlessly
      if (token && token.startsWith('mock-jwt-skywings-')) {
        const role = token.includes('teacher')
          ? 'teacher'
          : token.includes('parent')
          ? 'parent'
          : 'admin';
        req.user = {
          _id: 'usr_' + role + '_demo',
          name:
            role === 'teacher'
              ? 'Priya Mukherjee'
              : role === 'parent'
              ? 'Vikramaditya Roy'
              : 'Dr. Rajesh Sharma (Principal)',
          email: `${role}@skywings.com`,
          role: role,
        };
        return next();
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'supersecret_skywings_erp_key'
      );

      // Check MongoDB if connected
      const isMongoConnected = require('mongoose').connection.readyState === 1;
      if (isMongoConnected && decoded.id && decoded.id.length === 24) {
        try {
          req.user = await User.findById(decoded.id).select('-password');
        } catch (dbErr) {
          req.user = null;
        }
      }

      // Fallback for default personas if not fetched from DB
      if (!req.user && decoded.role) {
        const personas = {
          admin: { name: 'Dr. Rajesh Sharma (Principal)', email: 'admin@skywings.com' },
          teacher: { name: 'Priya Mukherjee', email: 'teacher@skywings.com' },
          parent: { name: 'Vikramaditya Roy', email: 'parent@skywings.com' },
        };
        const p = personas[decoded.role] || personas.admin;
        req.user = {
          _id: decoded.id || 'usr_' + decoded.role,
          name: p.name,
          email: p.email,
          role: decoded.role,
        };
      }

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User session invalid' });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user?.role || 'guest'}) is not allowed to access this resource`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };

