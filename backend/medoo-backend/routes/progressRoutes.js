// routes/progressRoutes.js
const express = require("express");
const { updateProgress, getProgress, getDashboardStats } = require("../controllers/progressController");
const auth = require("../middleware/auth");

const router = express.Router();
router.get('/', auth, getProgress); 
router.get('/stats/dashboard', auth, getDashboardStats);
router.post('/', auth, updateProgress);
router.get('/:courseId', auth, getProgress);

module.exports = router;
