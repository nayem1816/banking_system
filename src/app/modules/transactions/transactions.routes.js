const express = require("express");
const auth = require("../../middlewares/auth");
const TransactionController = require("./transactions.controller");

const router = express.Router();

router.post(
  "/all-users",
  auth(),
  TransactionController.createDailyTransactionForAllUsers
);

router.get("/my-transactions", auth(), TransactionController.getMyTransactions);
router.get(
  "/users-transactions",
  auth(),
  TransactionController.getUsersTransactions
);

module.exports = router;
