const express = require("express");
const auth = require("../../middlewares/auth");
const UserInfoController = require("./user_info.controller");
const { UploadImageCloudinary } = require("../../middlewares/uploadCloudinary");

const router = express.Router();

router.get("/my-info", auth(), UserInfoController.getMyInfo);

router.patch(
  "/update-my-info",
  auth(),
  UploadImageCloudinary.single("userPhoto"),
  UserInfoController.updateMyInfo
);

module.exports = router;
