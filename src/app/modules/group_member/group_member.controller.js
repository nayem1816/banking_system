const catchAsync = require("../../../shared/catchAsync");
const sendResponse = require("../../../shared/sendResponse");
const GroupMemberService = require("./group_member.service");

const getMyGroupMembers = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const result = await GroupMemberService.getMyGroupMembersService(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Get my group members",
    data: result,
  });
});

const getAssignGroupMembers = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    
    const result = await GroupMemberService.getAssignGroupMembersService(userId);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Get assign group members",
        data: result,
    });

});

module.exports = {
  getMyGroupMembers,
  getAssignGroupMembers
};
