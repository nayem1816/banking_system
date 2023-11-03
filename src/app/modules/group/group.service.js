const Group = require("./group.model");

const getMyCardInfoService = async (userId) => {
  const result = await Group.findOne({ user: userId });

  return result;
};

module.exports = {
  getMyCardInfoService,
};
