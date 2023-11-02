const ReferralCode = require("./referral_code.model");

const getMyReferralCodeService = async (userId) => {
  const result = await ReferralCode.findOne({ user: userId });

  return result;
};

module.exports = {
  getMyReferralCodeService,
};
