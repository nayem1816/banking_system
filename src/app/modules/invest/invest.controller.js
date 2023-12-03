const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const InvestService = require("./invest.service");

const createNewInvest = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const result = await InvestService.createNewInvestService(req.body, userId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Your Invest Request has been sent Successfully.",
    data: result,
  });
});

const getMyInvestList = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const result = await InvestService.getMyInvestListService(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My Invest List",
    data: result,
  });
});

module.exports = {
  createNewInvest,
  getMyInvestList,
};
