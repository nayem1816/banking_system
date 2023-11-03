const express = require("express");
const auth = require("../../middlewares/auth");
const GroupMemberController = require("./group_member.controller");

const router = express.Router();

router.get(
  "/my-group-members",
  auth(),
  GroupMemberController.getMyGroupMembers
);
router.get(
  "/assign-group-members",
  auth(),
  GroupMemberController.getAssignGroupMembers
);

module.exports = router;
