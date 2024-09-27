const express = require("express");
const router = express.Router();
const resultController = require("../controllers/resultController");

// Route to start the test
router.post("/v1/api/startTest", resultController.startTest);

module.exports = router;
