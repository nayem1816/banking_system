const paginationFields = require("../../../constants/pagination");
const catchAsync = require("../../../shared/catchAsync");
const pick = require("../../../shared/pick");
const sendResponse = require("../../../shared/sendResponse");
const { userFilterableFields } = require("./user.constant");
const UserService = require("./user.services");

const createUser = catchAsync(async (req, res, next) => {
  const userImage = req.file;

  let imageData = {};

  if (userImage?.path) {
    imageData = {
      url: userImage?.path,
      public_id: userImage?.filename,
    };
  }

  const result = await UserService.createUserService(req.body, imageData);

  const { password, ...userData } = result._doc;

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User created successfully",
    data: userData,
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

module.exports = {
  createUser,
  getAllUsers,
};
