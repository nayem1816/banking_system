const ReferralCode = require("./referral_code.model");

const getMyReferralCodeService = async (userId) => {
  // const result = await ReferralCode.findOne({ user: userId, isUsed: true });

  // if (!result) {
  //   throw new Error("Your referral code is not active. Please first invest.");
  // }

  const result = await ReferralCode.findOne({ user: userId });

  return result;
};

module.exports = {
  getMyReferralCodeService,
};
