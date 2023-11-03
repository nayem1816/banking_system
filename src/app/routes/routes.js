const express = require("express");
const AuthRoutes = require("../modules/auth/auth.routes");
const UserRoutes = require("../modules/users/user.routes");
const ReferralCodeRoutes = require("../modules/referral_code/referral_code.routes");
const GroupMemberRoutes = require("../modules/group_member/group_member.routes");

const router = express.Router();

const routes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/referral-code",
    route: ReferralCodeRoutes,
  },
  {
    path: "/group-member",
    route: GroupMemberRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

module.exports = router;
