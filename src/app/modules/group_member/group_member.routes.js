const express = require("express");
const auth = require("../../middlewares/auth");
const GroupMemberController = require("./group_member.controller");

const router = express.Router();

router.get(
  "/my-group-members",
  auth(),
  GroupMemberController.getMyGroupMembers
);

module.exports = router;
