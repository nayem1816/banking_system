const ReferralCode = require("./referral_code.model");

const getMyReferralCodeService = async (userId, userRole) => {
  let result;

  if (userRole === "super admin") {
    result = await ReferralCode.findOne({ user: userId });
  } else {
    result = await ReferralCode.findOne({ user: userId, isUsed: true });
    if (!result) {
      throw new Error("Your referral code is not active. Please first invest.");
    }
  }

  return result;
};

module.exports = {
  getMyReferralCodeService,
};
