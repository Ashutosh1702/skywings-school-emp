const AuditLog = require('../models/AuditLog');

const logAction = async ({ userId, action, entity, entityId, details, ipAddress }) => {
  try {
    // Sanitize details to avoid logging sensitive fields
    const sanitizedDetails = { ...details };
    delete sanitizedDetails.password;
    delete sanitizedDetails.token;
    delete sanitizedDetails.secret;

    await AuditLog.create({
      user: userId,
      action,
      entity,
      entityId: entityId ? entityId.toString() : '',
      details: sanitizedDetails,
      ipAddress: ipAddress || '',
    });
  } catch (error) {
    console.error('Failed to write audit log:', error.message);
  }
};

module.exports = { logAction };

