const express = require("express");
const auth = require("../../middlewares/auth");
const router = express.Router();
const InvestController = require("./invest.controller");

router.get("/my-invest-list", auth(), InvestController.getMyInvestList);
router.get(
  "/group-invest-info/:groupId",
  auth(),
  InvestController.getGroupInvestInfo
);
router.get("/my-invest-info", auth(), InvestController.getMyInvestInfo);
router.get("/user-invest-info", auth(), InvestController.getAllUserInvestInfo);
router.post("/", auth(), InvestController.createNewInvest);
router.get(
  "/",
  auth("super admin", "admin"),
  InvestController.getALlInvestList
);

router.get(
  "/:id",
  auth("super admin", "admin"),
  InvestController.getSingleInvest
);

router.patch(
  "/:id",
  auth("super admin", "admin"),
  InvestController.updateSingleInvest
);

module.exports = router;
