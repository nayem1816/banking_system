const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const InvestDurationService = require("./invest_duration.service");

const createInvestDuration = catchAsync(async (req, res, next) => {
  const result = await InvestDurationService.createInvestDurationService(
    req.body
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Interest Duration & Percentage Created Successfully.",
    data: result,
  });
});

const getAllInvestDuration = catchAsync(async (req, res, next) => {
  const result = await InvestDurationService.getAllInvestDurationService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Interest Duration & Percentage Fetched Successfully.",
    data: result,
  });
});

module.exports = {
  createInvestDuration,
  getAllInvestDuration,
};
