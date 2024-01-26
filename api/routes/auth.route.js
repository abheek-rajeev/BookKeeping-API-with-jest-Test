const express = require("express");
const authController = require("../controllers/auth.controller.js");
const verifyUser = require("../utils/verifyUser.js");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.get("/signout", verifyUser.verifyToken, authController.signout);

module.exports = router;
