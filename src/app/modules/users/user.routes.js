const express = require("express");
const UserController = require("./user.controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.post("/register", UserController.registerUser);
router.get("/", auth(), UserController.getAllUsers);

module.exports = router;
