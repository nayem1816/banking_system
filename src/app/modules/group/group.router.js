const express = require("express");
const auth = require("../../middlewares/auth");
const GroupController = require("./group.controller");

const router = express.Router();

router.get("/", auth(), GroupController.getMyCardInfo);

module.exports = router;
