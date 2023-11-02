const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const ReferralCodeService = require("./referral_code.service");

const getMyReferralCode = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const result = await ReferralCodeService.getMyReferralCodeService(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Referral code fetched successfully",
    data: result,
  });
});

module.exports = {
  getMyReferralCode,
};
