const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const GroupService = require("./group.service");

const getMyReferralCode = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const result = await GroupService.getMyCardInfoService(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My card info",
    data: result,
  });
});

module.exports = {
  getMyReferralCode,
};
