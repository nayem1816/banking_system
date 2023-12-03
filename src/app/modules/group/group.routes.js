const express = require("express");
const auth = require("../../middlewares/auth");
const GroupController = require("./group.controller");

const router = express.Router();

router.get("/", auth(), GroupController.getMyGroupInfo);
router.get("/my-groups", auth(), GroupController.getMyGroups);

module.exports = router;
