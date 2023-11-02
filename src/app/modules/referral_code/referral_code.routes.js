const express = require("express");
const auth = require("../../middlewares/auth");
const ReferralCodeController = require("./referral_code.controller");

const router = express.Router();

router.get(
  "/my-referral-code",
  auth(),
  ReferralCodeController.getMyReferralCode
);

module.exports = router;
