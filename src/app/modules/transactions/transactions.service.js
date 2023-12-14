const moment = require("moment");
const ApiError = require("../../../errors/apiError");
const Invest = require("../invest/invest.model");
const Transaction = require("./transactions.model");
const uniqid = require("uniqid");
const MyBalance = require("../my_balance/my_balance.model");
const { paginationHelpers } = require("../../../helpers/paginationHelpers");
const { transactionSearchableFields } = require("./transactions.constant");
const { default: mongoose } = require("mongoose");

const createDailyTransactionForAllUsersService = async (payload) => {
  const getAllInvest = await Invest.aggregate([
    {
      $match: {
        status: "approved",
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
  ]);

  const dailyTransactionList = [];
  const myBalanceList = [];

  await Promise.all(
    getAllInvest.map(async (invest) => {
      const totalAmountOfInvest =
        (invest.amount * invest.investDuration.interestPercentage) / 100;

      const totalDays = moment()
        .add(invest.investDuration.month, "months")
        .diff(moment(), "days");

      const dailyProfit = totalAmountOfInvest / totalDays;

      const notExpiredInvest = await Invest.findOne({
        _id: invest._id,
        status: "approved",
        endDate: {
          $gte: moment().endOf("day").toDate(),
        },
      });

      const isExistTransaction = await Transaction.findOne({
        investId: invest._id,
        createdAt: {
          $gte: moment().startOf("day").toDate(),
          $lte: moment().endOf("day").toDate(),
        },
      });

      if (notExpiredInvest && !isExistTransaction) {
        const dailyTransaction = {
          user: invest.user,
          investId: invest._id,
          amount: dailyProfit,
          transactionId: uniqid(),
        };

        const myBalance = {
          user: invest.user,
          amount: dailyProfit,
        };

        // same user can not push multiple time but can update amount
        const isExistMyBalance = myBalanceList.find(
          (myBalance) => myBalance.user.toString() === invest.user.toString()
        );

        if (isExistMyBalance) {
          isExistMyBalance.amount += dailyProfit;
        } else {
          myBalanceList.push(myBalance);
        }

        dailyTransactionList.push(dailyTransaction);
      }
    })
  );

  if (dailyTransactionList.length === 0) {
    throw new ApiError(400, "No transaction created");
  }

  const session = await Transaction.startSession();

  try {
    session.startTransaction();

    const result = await Transaction.insertMany(dailyTransactionList, {
      session,
    });

    await Promise.all(
      myBalanceList.map(async (myBalance) => {
        const isExistBalanceUser = await MyBalance.findOne({
          user: myBalance.user,
        });

        if (isExistBalanceUser) {
          await MyBalance.findOneAndUpdate(
            {
              user: myBalance.user,
            },
            {
              $inc: {
                amount: myBalance.amount,
              },
            },
            {
              session,
            }
          );
        } else {
          await MyBalance.create([myBalance], {
            session,
          });
        }
      })
    );

    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getMyTransactionsService = async (userId, filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const aggregationPipeline = [];
  const matchStage = {};

  matchStage.user = new mongoose.Types.ObjectId(userId);

  if (searchTerm) {
    const searchConditions = transactionSearchableFields.map((field) => ({
      [field]: {
        $regex: searchTerm,
        $options: "i",
      },
    }));

    matchStage.$or = searchConditions;
  }

  if (Object.keys(filtersData).length) {
    matchStage.$and = Object.entries(filtersData).map(([field, value]) => ({
      [field]: value,
    }));
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
      $lookup: {
        from: "invests",
        localField: "investId",
        foreignField: "_id",
        as: "investId",
      },
    },
    {
      $unwind: "$investId",
    },
    {
      $project: {
        user: {
          fullName: 1,
          email: 1,
        },
        investId: 1,
        amount: 1,
        transactionId: 1,
        createdAt: 1,
      },
    }
  );

  const result = await Transaction.aggregate(aggregationPipeline);
  const total = await Transaction.countDocuments(matchStage);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getUsersTransactionsService = async (filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const aggregationPipeline = [];
  const matchStage = {};

  if (searchTerm) {
    const searchConditions = transactionSearchableFields.map((field) => ({
      [field]: {
        $regex: searchTerm,
        $options: "i",
      },
    }));

    matchStage.$or = searchConditions;
  }

  if (Object.keys(filtersData).length) {
    matchStage.$and = Object.entries(filtersData).map(([field, value]) => ({
      [field]: value,
    }));
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
      $lookup: {
        from: "invests",
        localField: "investId",
        foreignField: "_id",
        as: "investId",
      },
    },
    {
      $unwind: "$investId",
    },
    {
      $project: {
        user: {
          fullName: 1,
          email: 1,
        },
        investId: 1,
        amount: 1,
        transactionId: 1,
        createdAt: 1,
      },
    }
  );

  const result = await Transaction.aggregate(aggregationPipeline);
  const total = await Transaction.countDocuments(matchStage);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

module.exports = {
  createDailyTransactionForAllUsersService,
  getMyTransactionsService,
  getUsersTransactionsService,
};
