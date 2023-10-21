const express = require("express");
const UserController = require("./user.controller");
const { UploadImageCloudinary } = require("../../middlewares/uploadCloudinary");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.post(
  "/",
  auth("Super Admin", "Admin"),
  UploadImageCloudinary.single("userImage"),
  UserController.createUser
);
router.get("/", auth(), UserController.getAllUsers);

module.exports = router;
