const express = require("express");
const router = express.Router();
const { allCategory } = require("../controller/CategoryController");

router.get("/", allCategory);

module.exports = router;
