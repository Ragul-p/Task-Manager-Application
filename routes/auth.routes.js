const express = require("express");
const passport = require("passport");
const router = express.Router();
const { logout, postLogin, getRegister, postRegister } = require("../controller/auth.controller");
const { ensureGuest } = require("../middleware/auth.middleware");



router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/", successRedirect: "/dashboard" }));

router.get("/logout", logout);
router.post("/login", postLogin);

router.get("/register", ensureGuest, getRegister);
router.post("/register", postRegister);



module.exports = router;