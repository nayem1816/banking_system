const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const MyBalanceService = require("./my_balance.service");

const getMyBalance = catchAsync(async (req, res, next) => {
  const result = await MyBalanceService.getMyBalanceService(req.user._id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "My Balance.",
    data: result,
  });
});

module.exports = {
  getMyBalance,
};
