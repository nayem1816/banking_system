const paginationFields = require("../../../constants/pagination");
const catchAsync = require("../../../shared/catchAsync");
const pick = require("../../../shared/pick");
const sendResponse = require("../../../shared/sendResponse");
const { userFilterableFields } = require("./user.constant");
const UserService = require("./user.services");

const registerUser = catchAsync(async (req, res, next) => {
  const result = await UserService.registerUserService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Your Registration is Successful.",
    data: result[0],
  });
});

const registerUserByAdmin = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const result = await UserService.registerUserByAdminService(req.body, userId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Your Registration is Successful.",
    data: result[0],
  });
});

const registerAdmin = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const result = await UserService.registerAdminService(req.body, userId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Admin Registration is Successful.",
    data: result[0],
  });
});

const getAllUsers = catchAsync(async (req, res, next) => {
  const filters = pick(req.query, userFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await UserService.getAllUsersService(
    filters,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All Users",
    data: result,
  });
});

const registerSuperAdmin = catchAsync(async (req, res, next) => {
  const result = await UserService.registerSuperAdminService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Super Admin Registration is Successful.",
    data: result[0],
  });
});

const getMyRole = catchAsync(async (req, res, next) => {
  const result = await UserService.getMyRoleService(req.user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My Role",
    data: result,
  });
});

module.exports = {
  registerUser,
  registerUserByAdmin,
  registerAdmin,
  registerSuperAdmin,
  getAllUsers,
  getMyRole,
};
