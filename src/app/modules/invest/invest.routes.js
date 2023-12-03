const express = require("express");
const auth = require("../../middlewares/auth");
const router = express.Router();
const InvestController = require("./invest.controller");

router.get("/my-invest-list", auth(), InvestController.getMyInvestList);

router.post("/", auth(), InvestController.createNewInvest);

module.exports = router;
