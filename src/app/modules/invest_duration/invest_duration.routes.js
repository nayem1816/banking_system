const express = require("express");
const auth = require("../../middlewares/auth");
const router = express.Router();
const InvestDurationController = require("./invest_duration.controller");

router.post(
  "/",
  auth("super admin", "admin"),
  InvestDurationController.createInvestDuration
);

router.get("/", auth(), InvestDurationController.getAllInvestDuration);

module.exports = router;
