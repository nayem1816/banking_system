const express = require("express");
const UserController = require("./user.controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.post("/register", UserController.registerUser);
router.post(
  "/register-user-by-admin",
  auth("super admin", "admin"),
  UserController.registerUserByAdmin
);
router.post(
  "/register/admin",
  auth("super admin"),
  UserController.registerAdmin
);
router.post(
  "/register/super-admin",
  // auth("super admin"),
  UserController.registerSuperAdmin
);
router.get("/my-role", auth(), UserController.getMyRole);
router.get("/", auth(), UserController.getAllUsers);

module.exports = router;
