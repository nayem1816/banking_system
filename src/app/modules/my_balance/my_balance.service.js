const MyBalance = require("./my_balance.model");

const getMyBalanceService = async (userId) => {
  const result = await MyBalance.findOne({ user: userId });

  return result;
};

module.exports = {
  getMyBalanceService,
};
