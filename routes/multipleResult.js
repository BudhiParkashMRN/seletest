const express = require("express");
const router = express.Router();
const multipleResultController = require("../controllers/multipleResultController");

// Route to start the test
router.post("/v1/api/startTest/m", multipleResultController.startTest);

module.exports = router;
