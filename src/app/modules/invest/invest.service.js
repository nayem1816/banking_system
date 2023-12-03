const { default: mongoose } = require("mongoose");
const ApiError = require("../../../errors/apiError");
const Group = require("../group/group.model");
const InvestDuration = require("../invest_duration/invest_duration.model");
const Invest = require("./invest.model");

const createNewInvestService = async (payload, userId) => {
  const requiredFields = [
    "group",
    "investDuration",
    "amount",
    "transactionId",
    "provider",
  ];

  for (const field of requiredFields) {
    if (!payload[field]) {
      throw new ApiError(400, `Please provide ${field}`);
    }
  }

  const isExistGroup = await Group.findOne({
    _id: payload.group,
  });
  if (!isExistGroup) {
    throw new ApiError(400, "Group not found");
  }

  const isExistDuration = InvestDuration.findOne({
    _id: payload.investDuration,
  });

  if (!isExistDuration) {
    throw new ApiError(400, "Invest duration not found");
  }

  payload.user = userId;

  if (payload.status) {
    delete payload.status;
  }

  if (payload.provider) {
    const provider = ["bkash", "nagad", "rocket"];
    if (!provider.includes(payload.provider)) {
      throw new ApiError(400, "Provider not found");
    }
  }

  const result = await Invest.create(payload);

  return result;
};

const getMyInvestListService = async (userId) => {
  const result = await Invest.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "investdurations",
        localField: "investDuration",
        foreignField: "_id",
        as: "investDuration",
      },
    },
    {
      $unwind: "$investDuration",
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
        _id: 1,
        amount: 1,
        transactionId: 1,
        provider: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
        group: 1,
        "investDuration._id": 1,
        "investDuration.month": 1,
        "investDuration.interestPercentage": 1,
        user: {
          _id: 1,
          fullName: 1,
          email: 1,
        },
      },
    },
    {
      $lookup: {
        from: "userinfos",
        localField: "user._id",
        foreignField: "userId",
        as: "userInfos",
      },
    },
    {
      $unwind: "$userInfos",
    },
    {
      $project: {
        _id: 1,
        amount: 1,
        transactionId: 1,
        provider: 1,
        status: 1,
        createdAt: 1,
        updatedAt: 1,
        group: 1,
        "investDuration._id": 1,
        "investDuration.month": 1,
        "investDuration.interestPercentage": 1,
        user: {
          _id: 1,
          fullName: 1,
          email: 1,
          phone: "$userInfos.phone",
          userPhoto: "$userInfos.userPhoto",
        },
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  return result;
};

module.exports = {
  createNewInvestService,
  getMyInvestListService,
};
