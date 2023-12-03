const ApiError = require("../../../errors/apiError");
const InvestDuration = require("./invest_duration.model");

const createInvestDurationService = async (payload) => {
  const requiredFields = ["month", "interestPercentage"];

  for (const field of requiredFields) {
    if (!payload[field]) {
      throw new ApiError(400, `Please provide ${field}`);
    }
  }

  const isExistMonth = await InvestDuration.findOne({
    month: payload.month,
  });

  if (isExistMonth) {
    throw new ApiError(400, "Month already exist");
  }

  const result = await InvestDuration.create(payload);

  return result;
};

const getAllInvestDurationService = async () => {
  const result = await InvestDuration.find({ status: "active" }).sort({
    month: 1,
  });

  return result;
};

module.exports = {
  createInvestDurationService,
  getAllInvestDurationService,
};
