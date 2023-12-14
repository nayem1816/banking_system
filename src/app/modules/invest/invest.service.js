const { default: mongoose } = require("mongoose");
const ApiError = require("../../../errors/apiError");
const Group = require("../group/group.model");
const InvestDuration = require("../invest_duration/invest_duration.model");
const Invest = require("./invest.model");
const { paginationHelpers } = require("../../../helpers/paginationHelpers");
const { investSearchableFields } = require("./invest.constant");
const ReferralCode = require("../referral_code/referral_code.model");
const moment = require("moment");

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

  if (payload.endDate) {
    delete payload.endDate;
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

const getALlInvestListService = async (filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const aggregationPipeline = [];
  const matchStage = {};

  if (searchTerm) {
    const searchConditions = investSearchableFields.map((field) => ({
      [field]: {
        $regex: searchTerm,
        $options: "i",
      },
    }));

    matchStage.$or = searchConditions;
  }

  if (Object.keys(filtersData).length) {
    matchStage.$and = Object.entries(filtersData).map(([field, value]) => {
      if (ObjectId.isValid(value)) {
        return {
          [field]: new mongoose.Types.ObjectId(value),
        };
      } else {
        return {
          [field]: value,
        };
      }
    });
  }

  if (Object.keys(matchStage).length > 0) {
    aggregationPipeline.push({ $match: matchStage });
  }

  // Sort Stage
  const sortConditions = {};

  // Dynamic sort needs fields to do sorting
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  // Add Sort Stage to Aggregation Pipeline
  if (Object.keys(sortConditions).length > 0) {
    aggregationPipeline.push({ $sort: sortConditions });
  }

  // Pagination Stage
  aggregationPipeline.push({ $skip: skip });
  aggregationPipeline.push({ $limit: limit });

  aggregationPipeline.push(
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
    }
  );

  const result = await Invest.aggregate(aggregationPipeline);
  const total = await Invest.countDocuments(matchStage);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleInvestService = async (id) => {
  const result = await Invest.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
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
  ]);

  return result;
};

const updateSingleInvestService = async (id, payload, userId) => {
  const isExistInvest = await Invest.findOne({
    _id: id,
  });

  const getMonth = await InvestDuration.findOne({
    _id: isExistInvest.investDuration,
  });

  if (!isExistInvest) {
    throw new ApiError(400, "Invest not found");
  }

  if (payload.status === "approved") {
    const startDate = moment().toDate();
    const endDate = moment().add(getMonth.month, "months").toDate();

    payload.startDate = startDate;
    payload.endDate = endDate;

    const checkReferCodeIsActive = await ReferralCode.findOne({
      user: isExistInvest.user,
      isUsed: false,
    });

    if (checkReferCodeIsActive) {
      await ReferralCode.findByIdAndUpdate(
        checkReferCodeIsActive._id,
        { $set: { isUsed: true } },
        { new: true }
      );

      payload.approvedBy = userId;
    }
  }

  const result = await Invest.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true }
  );

  return result;
};

const getGroupInvestInfoService = async (userId, groupId) => {
  const myTotalInvest = await Invest.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        group: new mongoose.Types.ObjectId(groupId),
        status: "approved",
      },
    },
    {
      $group: {
        _id: null,
        totalInvest: {
          $sum: "$amount",
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalInvest: 1,
      },
    },
  ]);

  const totalInvest = await Invest.aggregate([
    {
      $match: {
        group: new mongoose.Types.ObjectId(groupId),
        status: "approved",
      },
    },
    {
      $group: {
        _id: null,
        totalInvest: {
          $sum: "$amount",
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalInvest: 1,
      },
    },
  ]);

  const myTotalInvestAmount = myTotalInvest.length
    ? myTotalInvest[0].totalInvest
    : 0;

  const totalInvestAmount = totalInvest.length ? totalInvest[0].totalInvest : 0;

  const result = {
    myTotalInvestAmount,
    totalInvestAmount,
  };

  return result;
};

const getMyInvestInfoService = async (userId) => {
  const myTotalDeposit = await Invest.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        status: "approved",
      },
    },
    {
      $group: {
        _id: null,
        totalDeposit: {
          $sum: "$amount",
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalDeposit: 1,
      },
    },
  ]);

  const myTotalWithdraw = 0;

  const result = {
    myTotalDeposit: myTotalDeposit.length ? myTotalDeposit[0].totalDeposit : 0,
    myTotalWithdraw: myTotalWithdraw,
    totalBalanceOfAccount: myTotalDeposit.length
      ? myTotalDeposit[0].totalDeposit - myTotalWithdraw
      : 0,
  };

  return result;
};

const getAllUserInvestInfoService = async () => {
  const weeklyInvest = await Invest.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 7)),
        },
        status: "approved",
      },
    },
    {
      $group: {
        _id: null,
        totalInvest: {
          $sum: "$amount",
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalInvest: 1,
      },
    },
  ]);

  const monthlyInvest = await Invest.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
        status: "approved",
      },
    },
    {
      $group: {
        _id: null,
        totalInvest: {
          $sum: "$amount",
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalInvest: 1,
      },
    },
  ]);

  const totalInvest = await Invest.aggregate([
    {
      $match: {
        status: "approved",
      },
    },
    {
      $group: {
        _id: null,
        totalInvest: {
          $sum: "$amount",
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalInvest: 1,
      },
    },
  ]);

  return {
    weeklyInvest: weeklyInvest.length ? weeklyInvest[0].totalInvest : 0,
    monthlyInvest: monthlyInvest.length ? monthlyInvest[0].totalInvest : 0,
    totalInvest: totalInvest.length ? totalInvest[0].totalInvest : 0,
  };
};

module.exports = {
  createNewInvestService,
  getMyInvestListService,
  getALlInvestListService,
  getSingleInvestService,
  updateSingleInvestService,
  getGroupInvestInfoService,
  getMyInvestInfoService,
  getAllUserInvestInfoService,
};
