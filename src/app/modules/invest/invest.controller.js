const paginationFields = require("../../../constants/pagination");
const catchAsync = require("../../../shared/catchAsync");
const pick = require("../../../shared/pick");
const sendResponse = require("../../../shared/sendResponse");
const { investFilterableFields } = require("./invest.constant");
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

const getALlInvestList = catchAsync(async (req, res, next) => {
  const filters = pick(req.query, investFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await InvestService.getALlInvestListService(
    filters,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All Invest List",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleInvest = catchAsync(async (req, res, next) => {
  const result = await InvestService.getSingleInvestService(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Single Invest",
    data: result,
  });
});

const updateSingleInvest = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const result = await InvestService.updateSingleInvestService(
    req.params.id,
    req.body,
    userId
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Invest Updated Successfully",
    data: result,
  });
});

const getGroupInvestInfo = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const groupId = req.params.groupId;
  const result = await InvestService.getGroupInvestInfoService(userId, groupId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My Group Info",
    data: result,
  });
});

const getMyInvestInfo = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const result = await InvestService.getMyInvestInfoService(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My Invest Info",
    data: result,
  });
});

const getAllUserInvestInfo = catchAsync(async (req, res, next) => {
  const result = await InvestService.getAllUserInvestInfoService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User Invest Info",
    data: result,
  });
});

module.exports = {
  createNewInvest,
  getMyInvestList,
  getALlInvestList,
  getSingleInvest,
  updateSingleInvest,
  getGroupInvestInfo,
  getMyInvestInfo,
  getAllUserInvestInfo,
};
