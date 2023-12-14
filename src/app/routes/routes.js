const express = require("express");
const AuthRoutes = require("../modules/auth/auth.routes");
const UserRoutes = require("../modules/users/user.routes");
const ReferralCodeRoutes = require("../modules/referral_code/referral_code.routes");
const GroupRoutes = require("../modules/group/group.routes");
const GroupMemberRoutes = require("../modules/group_member/group_member.routes");
const UserInfoRoutes = require("../modules/user_info/user_info.routes");
const InvestDurationRoutes = require("../modules/invest_duration/invest_duration.routes");
const InvestRoutes = require("../modules/invest/invest.routes");
const TransactionsRoutes = require("../modules/transactions/transactions.routes");
const MyBalanceRoutes = require("../modules/my_balance/my_balance.routes");

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
    path: "/user-info",
    route: UserInfoRoutes,
  },
  {
    path: "/referral-code",
    route: ReferralCodeRoutes,
  },
  {
    path: "/group",
    route: GroupRoutes,
  },
  {
    path: "/group-member",
    route: GroupMemberRoutes,
  },
  {
    path: "/invest-duration",
    route: InvestDurationRoutes,
  },
  {
    path: "/invest",
    route: InvestRoutes,
  },
  {
    path: "/transaction",
    route: TransactionsRoutes,
  },
  {
    path: "/my-balance",
    route: MyBalanceRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

module.exports = router;
