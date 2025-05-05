// routes/progressRoutes.js
const express = require("express");
const { updateProgress, getProgress, getDashboardStats } = require("../controllers/progressController");
const auth = require("../middleware/auth");

const router = express.Router();
router.post("/", auth, updateProgress);
router.get("/:courseId", auth, getProgress);
// Thêm route mới
router.get("/stats/dashboard", auth, getDashboardStats);
module.exports = router;
