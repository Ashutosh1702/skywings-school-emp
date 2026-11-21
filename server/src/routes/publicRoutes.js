const express = require('express');
const router = express.Router();
const {
  getPublicWebsiteData,
  getPublicTimetable,
} = require('../controllers/publicController');

router.get('/website-data', getPublicWebsiteData);
router.get('/timetable', getPublicTimetable);

module.exports = router;

