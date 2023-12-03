const ApiError = require("../../../errors/apiError");
const GroupMember = require("../group_member/group_member.model");
const Group = require("./group.model");

const getMyCardInfoService = async (userId) => {
  const result = await Group.findOne({ user: userId });

  return result;
};

const getMyGroupsService = async (userId) => {
  const groupInfo = {};

  const myGroup = await Group.findOne({
    groupAdmin: userId,
  });

  if (myGroup) {
    groupInfo.myGroup = myGroup._id;
  } else {
    throw new ApiError(400, "You are not admin of any group");
  }

  const assignedGroup = await GroupMember.findOne({
    user: userId,
    group: { $ne: myGroup._id },
  });

  if (assignedGroup) {
    groupInfo.assignedGroup = assignedGroup.group;
  }

  return groupInfo;
};

module.exports = {
  getMyCardInfoService,
  getMyGroupsService,
};
