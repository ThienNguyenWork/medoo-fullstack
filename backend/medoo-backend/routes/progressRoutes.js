// routes/progressRoutes.js
const express = require("express");
const { updateProgress, getProgress } = require("../controllers/progressController");
const auth = require("../middleware/auth");

const router = express.Router();
router.post("/", auth, updateProgress);
router.get("/:courseId", auth, getProgress);

module.exports = router;
