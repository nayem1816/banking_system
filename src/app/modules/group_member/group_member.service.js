const { default: mongoose } = require("mongoose");
const Group = require("../group/group.model");
const GroupMember = require("./group_member.model");

const getMyGroupMembersService = async (userId) => {
  const groupInfo = await Group.findOne({ groupAdmin: userId });

  if (!groupInfo) {
    throw new Error("You are not a group admin");
  }

  const result = await GroupMember.aggregate([
    {
      $match: {
        group: new mongoose.Types.ObjectId(groupInfo._id),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        _id: 0,
        name: "$user.fullName",
        email: "$user.email",
        phone: "$user.phone",
        userId: "$user._id",
        isGroupAdmin: {
          $cond: {
            if: {
              $eq: ["$user._id", groupInfo.groupAdmin],
            },
            then: true,
            else: false,
          },
        },
        group: 1,
      },
    },
    {
      $sort: {
        isGroupAdmin: -1,
      },
    },
  ]);

  return result;
};

module.exports = {
  getMyGroupMembersService,
};
