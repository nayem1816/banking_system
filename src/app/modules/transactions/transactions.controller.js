const paginationFields = require("../../../constants/pagination");
const catchAsync = require("../../../shared/catchAsync");
const pick = require("../../../shared/pick");
const sendResponse = require("../../../shared/sendResponse");
const { transactionFilterableFields } = require("./transactions.constant");
const TransactionService = require("./transactions.service");

const createDailyTransactionForAllUsers = catchAsync(async (req, res, next) => {
  const result =
    await TransactionService.createDailyTransactionForAllUsersService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Daily Transaction Created Successfully.",
    data: result,
  });
});

const getMyTransactions = catchAsync(async (req, res, next) => {
  const filters = pick(req.query, transactionFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await TransactionService.getMyTransactionsService(
    req.user._id,
    filters,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My Transactions Fetched Successfully.",
    meta: result.meta,
    data: result.data,
  });
});

const getUsersTransactions = catchAsync(async (req, res, next) => {
  const filters = pick(req.query, transactionFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await TransactionService.getUsersTransactionsService(
    filters,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users Transactions Fetched Successfully.",
    meta: result.meta,
    data: result.data,
  });
});

module.exports = {
  createDailyTransactionForAllUsers,
  getMyTransactions,
  getUsersTransactions,
};
