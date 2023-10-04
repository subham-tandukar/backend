const express = require("express");
const router = new express.Router();

const userControllers = require("../controllers/userController");
const loginControllers = require("../controllers/loginController");
const categoryControllers = require("../controllers/categoryController");
const blogControllers = require("../controllers/blogController");

// ==============================
router.post("/api/user", userControllers.user);
router.post("/api/login", loginControllers.login);
router.post("/api/category", categoryControllers.category);
router.post("/api/blog", blogControllers.blog);
router.get("/api/getBlog", blogControllers.getBlog);

// -------------------------------

module.exports = router;
