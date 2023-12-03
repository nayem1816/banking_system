const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const GroupService = require("./group.service");

const getMyGroupInfo = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const result = await GroupService.getMyCardInfoService(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My card info",
    data: result,
  });
});

const getMyGroups = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const result = await GroupService.getMyGroupsService(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My groups",
    data: result,
  });
});

module.exports = {
  getMyGroupInfo,
  getMyGroups,
};
