const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const UserInfoService = require("./user_info.service");

const getMyInfo = catchAsync(async (req, res, next) => {
  const result = await UserInfoService.getMyInfoService(req.user._id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User info fetched successfully",
    data: result,
  });
});

const updateMyInfo = catchAsync(async (req, res, next) => {
  const photo = req.file;

  const userPhoto = {};
  if (photo?.url) {
    userPhoto.photo = photo.url;
    userPhoto.fileName = photo.originalname;
    userPhoto.public_id = photo.filename;
    userPhoto.type = photo.mimetype;
    userPhoto.size = photo.size; // bytes
  }

  const result = await UserInfoService.updateMyInfoService(
    req.user._id,
    req.body,
    userPhoto
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User info updated successfully",
    data: result,
  });
});

module.exports = {
  getMyInfo,
  updateMyInfo,
};
