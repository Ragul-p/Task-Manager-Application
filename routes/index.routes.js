const express = require("express");
const router = express.Router();

const { ensureAuth, ensureGuest } = require("../middleware/auth.middleware");
const { getLogin, getDashboard } = require("../controller/index.controller");



router.get("/", ensureGuest, getLogin);
router.get("/dashboard", ensureAuth, getDashboard);

module.exports = router;