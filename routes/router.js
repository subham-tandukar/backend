const express = require("express");
const router = new express.Router();

const userControllers = require("../controllers/userController");
const loginControllers = require("../controllers/loginController");

// ==============================
router.post("/api/user", userControllers.user);
router.post("/api/login", loginControllers.login);


// -------------------------------

module.exports = router;
