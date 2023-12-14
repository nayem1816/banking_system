const express = require("express");
const auth = require("../../middlewares/auth");
const MyBalanceController = require("./my_balance.controller");

const router = express.Router();

router.get("/", auth(), MyBalanceController.getMyBalance);

module.exports = router;
